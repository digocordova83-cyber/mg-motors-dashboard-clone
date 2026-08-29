from __future__ import annotations

import pandas as pd

from googleLeadsConsolidator import map_interlagos


def main() -> None:
    frame = pd.DataFrame(
        [
            {
                "created_at": "2026-08-27 13:51:04",
                "interest_model": "mg4_urban",
                "state": "SP",
                "city_label": "Espírito Santo do Pinhal",
                "dealership_label": "Stefanini — Campinas/SP",
                "name": "Fernando",
                "email": "fernando@example.com",
                "phone_e164": "+5519992003396",
            },
            {
                "created_at": "2026-08-27 13:52:06",
                "interest_model": "xpower",
                "state": "",
                "city_label": "",
                "dealership_label": "",
                "name": "Herico",
                "email": "herico@example.com",
                "phone_e164": "5555973565040",
            },
        ]
    )

    master_rows, import_rows, issues, empty_rows = map_interlagos(frame)
    assert issues == []
    assert empty_rows == 0
    assert len(master_rows) == 2
    assert master_rows[0] == {
        "Data": "2026-08-27 13:51:04",
        "Modelo": "MG4 URBAN",
        "Região ou Estado": "SP",
        "Cidade": "Espírito Santo do Pinhal",
        "Concessionaria": "Stefanini — Campinas/SP",
        "Nome": "Fernando",
        "Email": "fernando@example.com",
        "Telefone": "5519992003396",
        "Canal": "Campanha Urban",
    }
    assert import_rows[0]["Canal de Origem"] == "Interlagos"
    assert import_rows[0]["Data Corrigida"] == "27/08/2026"
    assert master_rows[1]["Modelo"] == "Indisponível"
    assert master_rows[1]["Concessionaria"] == "Indisponível"
    assert master_rows[1]["Canal"] == "Interlagos"
    assert import_rows[1]["Canal de Origem"] == "Interlagos"
    assert import_rows[1]["Data Corrigida"] == "27/08/2026"


if __name__ == "__main__":
    main()
