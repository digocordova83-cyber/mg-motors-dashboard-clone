#!/usr/bin/env python3
import unittest

import pandas as pd

from googleLeadsConsolidator import (
    clean_phone,
    map_mercado_livre,
    map_meta,
    map_site,
    map_uol,
    map_weebmotors,
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

    def test_all_sources_route_mg4_urban_to_campaign_urban(self):
        cases = [
            (
                "Site",
                map_site,
                pd.DataFrame(
                    [{
                        "Canal / Campanha": "Site institucional",
                        "Nome do solicitante": "Cliente Site",
                        "E-mail do solicitante": "site@example.com",
                        "Número de telefone do solicitante": "+5511999999001",
                        "Criação do ticket - Carimbo de data/hora": "2026-08-09 10:00:00",
                        "data": "09/08/2026",
                        "Estado": "SP",
                        "Cidade": "São Paulo",
                        "Concessionária": "Dealer Site",
                        "Modelo de Interesse": "MG 4 Urban",
                    }]
                ),
            ),
            (
                "Meta",
                map_meta,
                pd.DataFrame(
                    [{
                        "created_time": "2026-08-09T10:00:00Z",
                        "form_name": "Formulário MG4 Urban",
                        "em_qual_concessionária_gostaria_de_ser_atendido?_": "Dealer Meta",
                        "full_name": "Cliente Meta",
                        "phone_number": "+5511999999002",
                        "email": "meta@example.com",
                        "Cidade": "São Paulo",
                        "Estado": "SP",
                    }]
                ),
            ),
            (
                "Webmotors",
                map_weebmotors,
                pd.DataFrame(
                    [{
                        "recebimento_lead_ts": "09/08/2026 10:00",
                        "modelo": "MG4 URBAN",
                        "loja": "Dealer Webmotors",
                        "cidade": "São Paulo",
                        "estado": "SP",
                        "email": "webmotors@example.com",
                        "nomeCliente": "Cliente Webmotors",
                        "whatsapp": "+5511999999003",
                    }]
                ),
            ),
            (
                "Mercado Livre",
                map_mercado_livre,
                pd.DataFrame(
                    [{
                        "data": "2026-08-09",
                        "Concessionaria": "Dealer Mercado Livre",
                        "Usuario_legal": "Cliente Mercado Livre",
                        "Chave_2": "mercadolivre@example.com",
                        "Chave_3": "+5511999999004",
                        "Estado": "SP",
                        "Cidade": "São Paulo",
                        "modelo": "Linha MG4 Urban",
                    }]
                ),
            ),
            (
                "UOL",
                map_uol,
                pd.DataFrame(
                    [{
                        "Data da conversão": "09/08/2026",
                        "Modelo": "MG4 - Urban",
                        "Estado": "SP",
                        "Cidade": "São Paulo",
                        "Concessionária": "Dealer UOL",
                        "Nome": "Cliente UOL",
                        "Email": "uol@example.com",
                        "Telefone": "+5511999999005",
                    }]
                ),
            ),
        ]

        for source, mapper, frame in cases:
            with self.subTest(source=source):
                master, import_rows, issues, _ = mapper(frame)
                self.assertEqual(issues, [])
                self.assertEqual(master[0]["Modelo"], "MG4 URBAN")
                self.assertEqual(master[0]["Canal"], "Campanha Urban")
                self.assertEqual(import_rows[0]["Canal"], "Campanha Urban")

    def test_non_urban_model_keeps_original_source_channel(self):
        frame = pd.DataFrame(
            [{
                "created_time": "2026-08-09T10:00:00Z",
                "form_name": "Formulário MGS5",
                "em_qual_concessionária_gostaria_de_ser_atendido?_": "Dealer",
                "full_name": "Cliente",
                "phone_number": "+5511999999999",
                "email": "cliente@example.com",
                "Cidade": "São Paulo",
                "Estado": "SP",
            }]
        )
        master, import_rows, issues, _ = map_meta(frame)
        self.assertEqual(issues, [])
        self.assertEqual(master[0]["Canal"], "Meta")
        self.assertEqual(import_rows[0]["Canal"], "Meta")

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
