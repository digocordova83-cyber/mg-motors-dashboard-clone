#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import unicodedata
from collections import Counter
from dataclasses import asdict, dataclass
from datetime import datetime
from pathlib import Path
from typing import Any, Callable

import pandas as pd
import requests


SPREADSHEET_ID = "1DnkkrrU3GqcuBd5br_OQDaGMMtA2iN2ik4yEV5-Ggw8"
DEFAULT_SOURCE_URL = (
    f"https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/export?format=xlsx"
)
SOURCE_SHEET_GROUPS = (
    ("Site", ("Site",)),
    ("TikTok", ("TikTok", "Tikok")),
    ("Meta", ("Meta",)),
    ("Weebmotors", ("Weebmotors",)),
    ("Mercado Livre", ("Mercado Livre",)),
    ("Uol", ("Uol",)),
)
MASTER_COLUMNS = (
    "Data",
    "Modelo",
    "Região ou Estado",
    "Cidade",
    "Concessionaria",
    "Nome",
    "Email",
    "Telefone",
    "Canal",
)
IMPORT_COLUMNS = (
    "Data",
    "Modelo",
    "Região/Estado",
    "Cidade",
    "Concessionaria",
    "Nome",
    "Email",
    "Telefone",
    "Canal",
    "Data Corrigida",
    "Concessionarias corrijida",
    "Canal de Origem",
)


@dataclass
class MappingIssue:
    sheet: str
    source_row: int
    field: str
    value: str
    message: str


@dataclass
class SheetStats:
    sheet: str
    rows_read: int
    rows_output: int
    rows_empty: int
    rows_with_issues: int


def text(value: Any) -> str:
    if value is None or pd.isna(value):
        return ""
    return str(value)


def normalize_header(value: Any) -> str:
    return (
        unicodedata.normalize("NFKC", text(value))
        .replace("\u00a0", " ")
        .strip()
    )


def folded(value: Any) -> str:
    normalized = unicodedata.normalize("NFD", normalize_header(value))
    without_marks = "".join(ch for ch in normalized if unicodedata.category(ch) != "Mn")
    return re.sub(r"[^A-Z0-9]+", " ", without_marks.upper()).strip()


def clean_phone(value: Any) -> str:
    cleaned = re.sub(r"^\s*p\s*:\s*", "", text(value), flags=re.IGNORECASE)
    return cleaned.replace("+", "").strip()


def normalize_model(value: Any) -> str:
    key = folded(value)
    if not key:
        return ""
    if "CYBERSTER" in key:
        return "CYBERSTER"
    if "URBAN" in key:
        return "MG4 URBAN"
    if re.search(r"(?:^| )MG ?S?5(?: |$)", key) or key == "S5":
        return "MGS5"
    if re.search(r"(?:^| )MG ?4(?: |$)", key) or key == "4":
        return "MG4"
    return ""


def parse_date(value: Any, *, dayfirst: bool) -> str:
    raw = text(value).strip()
    if not raw:
        return ""
    iso = re.match(r"^(\d{4})-(\d{2})-(\d{2})", raw)
    if iso:
        parsed = pd.to_datetime(iso.group(0), format="%Y-%m-%d", errors="coerce")
    else:
        br = re.match(r"^(\d{2})/(\d{2})/(\d{4})", raw)
        if br:
            parsed = pd.to_datetime(br.group(0), format="%d/%m/%Y", errors="coerce")
        else:
            javascript_date = re.search(r"[A-Za-z]{3} [A-Za-z]{3} \d{2} \d{4}", raw)
            if javascript_date:
                parsed = pd.to_datetime(
                    javascript_date.group(0), format="%a %b %d %Y", errors="coerce"
                )
            else:
                parsed = pd.to_datetime(raw, errors="coerce", dayfirst=dayfirst, utc=False)
    if pd.isna(parsed):
        return ""
    return parsed.strftime("%d/%m/%Y")


def parse_dealer_location(value: Any) -> tuple[str, str]:
    raw = normalize_header(value)
    match = re.search(r"\s+-\s+(.+?)\s*/\s*([A-Za-z]{2})\s*$", raw)
    if not match:
        return "", ""
    return match.group(1).strip(), match.group(2).upper()


def normalize_columns(frame: pd.DataFrame) -> pd.DataFrame:
    renamed = {column: normalize_header(column) for column in frame.columns}
    return frame.rename(columns=renamed)


def resolve_column(frame: pd.DataFrame, *aliases: str) -> str:
    by_key = {folded(column): column for column in frame.columns}
    for alias in aliases:
        match = by_key.get(folded(alias))
        if match is not None:
            return match
    raise KeyError(f"Coluna não encontrada. Esperado um de: {', '.join(aliases)}")


def optional_column(frame: pd.DataFrame, *aliases: str) -> str | None:
    try:
        return resolve_column(frame, *aliases)
    except KeyError:
        return None


def row_value(row: pd.Series, column: str | None) -> str:
    return text(row[column]) if column is not None else ""


def is_empty_source_row(values: list[str]) -> bool:
    return not any(value.strip() for value in values)


def build_record(
    *,
    source_date: str,
    corrected_date: str,
    model_source: str,
    region: str,
    city: str,
    dealer: str,
    name: str,
    email: str,
    phone: str,
    channel: str,
    source_channel: str,
) -> tuple[dict[str, str], dict[str, str]]:
    model = normalize_model(model_source)
    cleaned_phone = clean_phone(phone)
    resolved_channel = (
        "TikTok"
        if folded(source_channel) == "TIKTOK"
        else "Campanha Urban"
        if model == "MG4 URBAN"
        else channel
    )
    master = {
        "Data": source_date,
        "Modelo": model,
        "Região ou Estado": region,
        "Cidade": city,
        "Concessionaria": dealer,
        "Nome": name,
        "Email": email,
        "Telefone": cleaned_phone,
        "Canal": resolved_channel,
    }
    import_row = {
        "Data": source_date,
        "Modelo": model,
        "Região/Estado": region,
        "Cidade": city,
        "Concessionaria": dealer,
        "Nome": name,
        "Email": email,
        "Telefone": cleaned_phone,
        "Canal": resolved_channel,
        "Data Corrigida": corrected_date,
        "Concessionarias corrijida": dealer,
        "Canal de Origem": source_channel,
    }
    return master, import_row


def map_site(frame: pd.DataFrame) -> tuple[list[dict[str, str]], list[dict[str, str]], list[MappingIssue], int]:
    campaign = resolve_column(frame, "Canal / Campanha")
    name = resolve_column(frame, "Nome do solicitante")
    email = resolve_column(frame, "E-mail do solicitante")
    phone = resolve_column(frame, "Número de telefone do solicitante")
    timestamp = resolve_column(frame, "Criação do ticket - Carimbo de data/hora")
    source_date = resolve_column(frame, "data")
    region = resolve_column(frame, "Estado")
    city = resolve_column(frame, "Cidade")
    dealer = resolve_column(frame, "Concessionária")
    model = resolve_column(frame, "Modelo de Interesse")
    return map_rows(
        "Site",
        frame,
        empty_columns=(timestamp, name, email, phone, dealer, model),
        mapper=lambda row: build_record(
            source_date=row_value(row, source_date) or row_value(row, timestamp),
            corrected_date=parse_date(
                row_value(row, source_date) or row_value(row, timestamp), dayfirst=True
            ),
            model_source=row_value(row, model),
            region=row_value(row, region),
            city=row_value(row, city),
            dealer=row_value(row, dealer),
            name=row_value(row, name),
            email=row_value(row, email),
            phone=row_value(row, phone),
            channel="Campanha Urban" if "URBAN" in folded(row_value(row, campaign)) else "Site",
            source_channel="Site",
        ),
        model_source=lambda row: row_value(row, model),
        corrected_date_source=lambda row: row_value(row, source_date) or row_value(row, timestamp),
    )


def map_meta(frame: pd.DataFrame) -> tuple[list[dict[str, str]], list[dict[str, str]], list[MappingIssue], int]:
    source_date = resolve_column(frame, "created_time")
    form_name = resolve_column(frame, "form_name")
    dealer = resolve_column(
        frame,
        "em_qual_concessionária_gostaria_de_ser_atendido?_",
        "em_qual_concessionaria_gostaria_de_ser_atendido?_",
    )
    name = resolve_column(frame, "full_name")
    phone = resolve_column(frame, "phone_number")
    email = resolve_column(frame, "email")
    city = resolve_column(frame, "Cidade")
    region = resolve_column(frame, "Estado")
    return map_rows(
        "Meta",
        frame,
        empty_columns=(source_date, name, email, phone, dealer, form_name),
        mapper=lambda row: build_record(
            source_date=row_value(row, source_date),
            corrected_date=parse_date(row_value(row, source_date), dayfirst=False),
            model_source=row_value(row, form_name),
            region=row_value(row, region),
            city=row_value(row, city),
            dealer=row_value(row, dealer),
            name=row_value(row, name),
            email=row_value(row, email),
            phone=row_value(row, phone),
            channel="Meta",
            source_channel="Meta",
        ),
        model_source=lambda row: row_value(row, form_name),
        corrected_date_source=lambda row: row_value(row, source_date),
    )


def map_tiktok(frame: pd.DataFrame) -> tuple[list[dict[str, str]], list[dict[str, str]], list[MappingIssue], int]:
    source_date = resolve_column(frame, "created_time")
    model = resolve_column(frame, "ad_name", "ad name")
    dealer = resolve_column(
        frame,
        "Em qual concessionária gostaria de ser atendido?",
        "Em qual concessionaria gostaria de ser atendido?",
    )
    name = resolve_column(frame, "Name", "Nome")
    phone = resolve_column(frame, "Phone number", "Telefone", "phone_number")
    email = resolve_column(frame, "Email", "E-mail")

    def mapper(row: pd.Series) -> tuple[dict[str, str], dict[str, str]]:
        dealer_value = row_value(row, dealer)
        city_value, region_value = parse_dealer_location(dealer_value)
        return build_record(
            source_date=row_value(row, source_date),
            corrected_date=parse_date(row_value(row, source_date), dayfirst=False),
            model_source=row_value(row, model),
            region=region_value,
            city=city_value,
            dealer=dealer_value,
            name=row_value(row, name),
            email=row_value(row, email),
            phone=row_value(row, phone),
            channel="TikTok",
            source_channel="TikTok",
        )

    return map_rows(
        "TikTok",
        frame,
        empty_columns=(source_date, name, email, phone, dealer, model),
        mapper=mapper,
        model_source=lambda row: row_value(row, model),
        corrected_date_source=lambda row: row_value(row, source_date),
    )


def map_weebmotors(frame: pd.DataFrame) -> tuple[list[dict[str, str]], list[dict[str, str]], list[MappingIssue], int]:
    source_date = resolve_column(frame, "recebimento_lead_ts")
    model = resolve_column(frame, "modelo")
    dealer = resolve_column(frame, "loja")
    city = resolve_column(frame, "cidade")
    region = resolve_column(frame, "estado")
    email = resolve_column(frame, "email")
    name = resolve_column(frame, "nomeCliente")
    phone = resolve_column(frame, "whatsapp")
    return map_rows(
        "Weebmotors",
        frame,
        empty_columns=(source_date, name, email, phone, dealer, model),
        mapper=lambda row: build_record(
            source_date=row_value(row, source_date),
            corrected_date=parse_date(row_value(row, source_date), dayfirst=True),
            model_source=row_value(row, model),
            region=row_value(row, region),
            city=row_value(row, city),
            dealer=row_value(row, dealer),
            name=row_value(row, name),
            email=row_value(row, email),
            phone=row_value(row, phone),
            channel="Webmotors",
            source_channel="Webmotors",
        ),
        model_source=lambda row: row_value(row, model),
        corrected_date_source=lambda row: row_value(row, source_date),
    )


def map_mercado_livre(frame: pd.DataFrame) -> tuple[list[dict[str, str]], list[dict[str, str]], list[MappingIssue], int]:
    source_date = resolve_column(frame, "data")
    dealer = resolve_column(frame, "Concessionaria")
    name = resolve_column(frame, "Usuario_legal")
    email = resolve_column(frame, "Chave_2")
    phone = resolve_column(frame, "Chave_3")
    region = resolve_column(frame, "Estado")
    city = resolve_column(frame, "Cidade")
    model = resolve_column(frame, "modelo")
    return map_rows(
        "Mercado Livre",
        frame,
        empty_columns=(source_date, name, email, phone, dealer, model),
        mapper=lambda row: build_record(
            source_date=row_value(row, source_date),
            corrected_date=parse_date(row_value(row, source_date), dayfirst=False),
            model_source=row_value(row, model),
            region=row_value(row, region),
            city=row_value(row, city),
            dealer=row_value(row, dealer),
            name=row_value(row, name),
            email=row_value(row, email),
            phone=row_value(row, phone),
            channel="Mercado Livre",
            source_channel="Mercado Livre",
        ),
        model_source=lambda row: row_value(row, model),
        corrected_date_source=lambda row: row_value(row, source_date),
    )


def map_uol(frame: pd.DataFrame) -> tuple[list[dict[str, str]], list[dict[str, str]], list[MappingIssue], int]:
    source_date = resolve_column(frame, "Data da conversão")
    model = resolve_column(frame, "Modelo")
    region = resolve_column(frame, "Estado")
    city = resolve_column(frame, "Cidade")
    dealer = resolve_column(frame, "Concessionária")
    name = resolve_column(frame, "Nome")
    email = resolve_column(frame, "Email")
    phone = resolve_column(frame, "Telefone")
    return map_rows(
        "Uol",
        frame,
        empty_columns=(source_date, name, email, phone, dealer, model),
        mapper=lambda row: build_record(
            source_date=row_value(row, source_date),
            corrected_date=parse_date(row_value(row, source_date), dayfirst=True),
            model_source=row_value(row, model),
            region=row_value(row, region),
            city=row_value(row, city),
            dealer=row_value(row, dealer),
            name=row_value(row, name),
            email=row_value(row, email),
            phone=row_value(row, phone),
            channel="UOL",
            source_channel="UOL",
        ),
        model_source=lambda row: row_value(row, model),
        corrected_date_source=lambda row: row_value(row, source_date),
    )


def map_rows(
    sheet: str,
    frame: pd.DataFrame,
    *,
    empty_columns: tuple[str, ...],
    mapper: Callable[[pd.Series], tuple[dict[str, str], dict[str, str]]],
    model_source: Callable[[pd.Series], str],
    corrected_date_source: Callable[[pd.Series], str],
) -> tuple[list[dict[str, str]], list[dict[str, str]], list[MappingIssue], int]:
    master_rows: list[dict[str, str]] = []
    import_rows: list[dict[str, str]] = []
    issues: list[MappingIssue] = []
    empty_rows = 0
    for index, row in frame.iterrows():
        if is_empty_source_row([row_value(row, column) for column in empty_columns]):
            empty_rows += 1
            continue
        master, import_row = mapper(row)
        source_row = int(index) + 2
        row_has_issue = False
        if not master["Modelo"]:
            row_has_issue = True
            issues.append(
                MappingIssue(
                    sheet=sheet,
                    source_row=source_row,
                    field="Modelo",
                    value=model_source(row),
                    message="Modelo fora de MG4 URBAN, MG4, MGS5 ou CYBERSTER.",
                )
            )
        if not import_row["Data Corrigida"]:
            row_has_issue = True
            issues.append(
                MappingIssue(
                    sheet=sheet,
                    source_row=source_row,
                    field="Data Corrigida",
                    value=corrected_date_source(row),
                    message="Data não pôde ser convertida para DD/MM/AAAA.",
                )
            )
        if not import_row["Concessionarias corrijida"].strip():
            row_has_issue = True
            issues.append(
                MappingIssue(
                    sheet=sheet,
                    source_row=source_row,
                    field="Concessionaria",
                    value="",
                    message="Concessionária ausente na origem.",
                )
            )
        if not row_has_issue:
            master_rows.append(master)
            import_rows.append(import_row)
    return master_rows, import_rows, issues, empty_rows


SHEET_MAPPERS: dict[
    str,
    Callable[[pd.DataFrame], tuple[list[dict[str, str]], list[dict[str, str]], list[MappingIssue], int]],
] = {
    "Site": map_site,
    "TikTok": map_tiktok,
    "Meta": map_meta,
    "Weebmotors": map_weebmotors,
    "Mercado Livre": map_mercado_livre,
    "Uol": map_uol,
}


def download_source(url: str, target: Path, timeout_seconds: int) -> None:
    response = requests.get(url, timeout=timeout_seconds)
    response.raise_for_status()
    if len(response.content) > 50 * 1024 * 1024:
        raise ValueError("A exportação XLSX excede o limite de 50 MB.")
    target.write_bytes(response.content)


def write_outputs(
    master_rows: list[dict[str, str]],
    import_rows: list[dict[str, str]],
    output_dir: Path,
    run_label: str,
) -> tuple[Path, Path, Path]:
    master_frame = pd.DataFrame(master_rows, columns=MASTER_COLUMNS)
    import_frame = pd.DataFrame(import_rows, columns=IMPORT_COLUMNS)
    master_csv = output_dir / f"leads-mg-consolidado-{run_label}.csv"
    master_xlsx = output_dir / f"leads-mg-consolidado-{run_label}.xlsx"
    import_csv = output_dir / f"leads-mg-import-{run_label}.csv"
    master_frame.to_csv(master_csv, index=False, encoding="utf-8")
    master_frame.to_excel(master_xlsx, index=False, engine="openpyxl")
    import_frame.to_csv(import_csv, index=False, encoding="utf-8")
    return master_csv, master_xlsx, import_csv


def consolidate(source_file: Path, output_dir: Path, run_label: str) -> dict[str, Any]:
    output_dir.mkdir(parents=True, exist_ok=True)
    workbook = pd.ExcelFile(source_file, engine="openpyxl")
    sheet_names_by_key = {folded(name): name for name in workbook.sheet_names}
    sheet_plan: list[tuple[str, str]] = []
    missing_sheets: list[str] = []
    for logical_name, aliases in SOURCE_SHEET_GROUPS:
        actual_name = next(
            (sheet_names_by_key[folded(alias)] for alias in aliases if folded(alias) in sheet_names_by_key),
            None,
        )
        if actual_name is None:
            missing_sheets.append("/".join(aliases))
        else:
            sheet_plan.append((logical_name, actual_name))
    if missing_sheets:
        raise ValueError(f"Aba(s) ausente(s): {', '.join(missing_sheets)}")

    all_master: list[dict[str, str]] = []
    all_import: list[dict[str, str]] = []
    all_issues: list[MappingIssue] = []
    sheet_stats: list[SheetStats] = []

    for logical_sheet, source_sheet in sheet_plan:
        frame = normalize_columns(
            pd.read_excel(
                source_file,
                sheet_name=source_sheet,
                dtype=str,
                keep_default_na=False,
                na_filter=False,
                engine="openpyxl",
            )
        )
        master_rows, import_rows, issues, empty_rows = SHEET_MAPPERS[logical_sheet](frame)
        all_master.extend(master_rows)
        all_import.extend(import_rows)
        all_issues.extend(issues)
        sheet_stats.append(
            SheetStats(
                sheet=logical_sheet,
                rows_read=len(frame),
                rows_output=len(master_rows),
                rows_empty=empty_rows,
                rows_with_issues=len({issue.source_row for issue in issues}),
            )
        )

    master_csv, master_xlsx, import_csv = write_outputs(
        all_master, all_import, output_dir, run_label
    )
    channels = Counter(row["Canal"] for row in all_master)
    source_channels = Counter(row["Canal de Origem"] for row in all_import)
    models = Counter(row["Modelo"] or "INVALIDO" for row in all_master)
    source_rows_total = sum(stats.rows_read - stats.rows_empty for stats in sheet_stats)
    report = {
        "sourceFile": str(source_file),
        "masterCsv": str(master_csv),
        "masterXlsx": str(master_xlsx),
        "importCsv": str(import_csv),
        "rowsSourceTotal": source_rows_total,
        "rowsMasterOutput": len(all_master),
        "rowsImportReady": len(all_import),
        "rowsExcludedFromImport": source_rows_total - len(all_import),
        "issuesTotal": len(all_issues),
        "rowsWithIssues": len({(issue.sheet, issue.source_row) for issue in all_issues}),
        "channels": dict(channels.most_common()),
        "sourceChannels": dict(source_channels.most_common()),
        "models": dict(models.most_common()),
        "sheets": [asdict(stats) for stats in sheet_stats],
        "issues": [asdict(issue) for issue in all_issues[:100]],
    }
    return report


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Consolida as abas de Leads MG em XLSX e CSV.")
    parser.add_argument("--source-file", type=Path)
    parser.add_argument("--source-url", default=DEFAULT_SOURCE_URL)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--run-label", default=datetime.now().strftime("%Y%m%d-%H%M%S"))
    parser.add_argument("--report-json", type=Path, required=True)
    parser.add_argument("--download-timeout", type=int, default=90)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    source_file = args.source_file
    if source_file is None:
        source_file = args.output_dir / f"google-leads-source-{args.run_label}.xlsx"
        download_source(args.source_url, source_file, args.download_timeout)
    report = consolidate(source_file, args.output_dir, args.run_label)
    args.report_json.write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(json.dumps(report, ensure_ascii=False))


if __name__ == "__main__":
    main()
