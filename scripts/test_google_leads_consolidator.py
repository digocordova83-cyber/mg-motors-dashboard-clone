#!/usr/bin/env python3
import unittest

import pandas as pd

from googleLeadsConsolidator import (
    clean_phone,
    map_meta,
    map_site,
    normalize_model,
)


class GoogleLeadsConsolidatorTest(unittest.TestCase):
    def test_normalizes_only_the_allowed_models(self):
        self.assertEqual(normalize_model("Formulário Jul/26 - MG4 Urban"), "MG4 URBAN")
        self.assertEqual(normalize_model("S5"), "MGS5")
        self.assertEqual(normalize_model("MG 4"), "MG4")
        self.assertEqual(normalize_model("Cyberster"), "CYBERSTER")
        self.assertEqual(normalize_model("outro"), "")

    def test_cleans_only_requested_phone_prefixes(self):
        self.assertEqual(clean_phone("p: +5511999999999"), "5511999999999")

    def test_site_urban_channel_and_dealer_fidelity(self):
        frame = pd.DataFrame(
            [
                {
                    "Canal / Campanha": "Campanha Urban lançamento",
                    "Nome do solicitante": "Cliente",
                    "E-mail do solicitante": "cliente@example.com",
                    "Número de telefone do solicitante": "+5511999999999",
                    "Criação do ticket - Carimbo de data/hora": "2026-08-05 09:20:00",
                    "data": "05/08/2026",
                    "Estado": "SP",
                    "Cidade": "São Paulo",
                    "Concessionária": "  Dealer fiel à origem  ",
                    "Modelo de Interesse": "MG4 Urban",
                }
            ]
        )
        master, import_rows, issues, _ = map_site(frame)
        self.assertEqual(issues, [])
        self.assertEqual(master[0]["Canal"], "Campanha Urban")
        self.assertEqual(master[0]["Concessionaria"], "  Dealer fiel à origem  ")
        self.assertEqual(import_rows[0]["Concessionarias corrijida"], "  Dealer fiel à origem  ")

    def test_meta_uses_form_name_and_excludes_invalid_model(self):
        frame = pd.DataFrame(
            [
                {
                    "created_time": "8/5/26",
                    "form_name": "Formulário - modelo desconhecido",
                    "em_qual_concessionária_gostaria_de_ser_atendido?_": "Dealer",
                    "full_name": "Cliente",
                    "phone_number": "+5511999999999",
                    "email": "cliente@example.com",
                    "Cidade": "São Paulo",
                    "Estado": "SP",
                }
            ]
        )
        master, import_rows, issues, _ = map_meta(frame)
        self.assertEqual(master, [])
        self.assertEqual(import_rows, [])
        self.assertEqual(issues[0].field, "Modelo")


if __name__ == "__main__":
    unittest.main()
