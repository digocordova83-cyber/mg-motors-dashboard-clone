import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CampaignIdentity } from "./CampaignIdentity";

describe("CampaignIdentity", () => {
  it("exibe o nome completo e o ID real sem truncamento", () => {
    const campaignName = "MG_Marca_SEM_SP_Campanha_Com_Nome_Extremamente_Longo_E_Sem_Espacos";
    const campaignId = "23906853014";

    const markup = renderToStaticMarkup(
      <CampaignIdentity name={campaignName} campaignId={campaignId} />,
    );

    expect(markup).toContain(campaignName);
    expect(markup).toContain(`ID ${campaignId}`);
    expect(markup).toContain("overflow-wrap:anywhere");
    expect(markup).not.toContain("truncate");
  });
});
