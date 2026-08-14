from __future__ import annotations

import pandas as pd

from googleLeadsConsolidator import map_tiktok


def main() -> None:
    frame = pd.DataFrame(
        [
            {
                "created_time": "2026-08-14 10:20:10(UTC-03:00)",
                "ad_name": "MG4 - Urban",
                "Email": "urban@example.com",
                "Name": "Cliente Urban",
                "Phone number": "+5581999990001",
                "Em qual concessionária gostaria de ser atendido?": "Autobrand Recife - Recife/PE",
            },
            {
                "created_time": "2026-08-14 10:21:10(UTC-03:00)",
                "ad_name": "MGS5",
                "Email": "mgs5@example.com",
                "Name": "Cliente MGS5",
                "Phone number": "p: +5511999990002",
                "Em qual concessionária gostaria de ser atendido?": "Baltic Guarulhos - Guarulhos/SP",
            },
        ]
    )

    master_rows, import_rows, issues, empty_rows = map_tiktok(frame)
    assert issues == []
    assert empty_rows == 0
    assert len(master_rows) == 2
    assert master_rows[0] == {
        "Data": "2026-08-14 10:20:10(UTC-03:00)",
        "Modelo": "MG4 URBAN",
        "Região ou Estado": "PE",
        "Cidade": "Recife",
        "Concessionaria": "Autobrand Recife - Recife/PE",
        "Nome": "Cliente Urban",
        "Email": "urban@example.com",
        "Telefone": "5581999990001",
        "Canal": "Campanha Urban",
    }
    assert import_rows[0]["Canal de Origem"] == "TikTok"
    assert import_rows[0]["Data Corrigida"] == "14/08/2026"
    assert master_rows[1]["Modelo"] == "MGS5"
    assert master_rows[1]["Canal"] == "TikTok"
    assert master_rows[1]["Região ou Estado"] == "SP"
    assert master_rows[1]["Cidade"] == "Guarulhos"
    assert master_rows[1]["Telefone"] == "5511999990002"


if __name__ == "__main__":
    main()
