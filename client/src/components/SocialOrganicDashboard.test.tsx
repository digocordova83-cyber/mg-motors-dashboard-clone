import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  formatOrganicDelta,
  SOCIAL_ORGANIC_COPY,
} from "./SocialOrganicDashboard";

describe("interface Social Orgânico", () => {
  it("mantém os principais rótulos analíticos em português e inglês", () => {
    expect(SOCIAL_ORGANIC_COPY["pt-BR"]).toMatchObject({
      title: "Inteligência de Comunidade e Conteúdo",
      currentFollowers: "Seguidores atuais",
      newFollowers: "Novos seguidores",
      contentTitle: "Conteúdos em destaque",
      netFollowerGrowth: "Crescimento líquido",
      videoTitle: "Vídeos em destaque",
    });
    expect(SOCIAL_ORGANIC_COPY["en-US"]).toMatchObject({
      title: "Community and Content Intelligence",
      currentFollowers: "Current followers",
      newFollowers: "New followers",
      contentTitle: "Top content",
      netFollowerGrowth: "Net follower growth",
      videoTitle: "Top videos",
    });
  });

  it("formata variações em ambos os idiomas e preserva indisponibilidade", () => {
    const comparison = {
      current: 120,
      previous: 100,
      absoluteChange: 20,
      percentChange: 20,
    };
    expect(formatOrganicDelta(comparison, "pt-BR")).toBe(
      "+20% vs período anterior equivalente",
    );
    expect(formatOrganicDelta(comparison, "en-US")).toBe(
      "+20% vs equivalent previous period",
    );
    expect(
      formatOrganicDelta({ ...comparison, percentChange: null }, "en-US"),
    ).toBe("Percentage comparison unavailable");
  });

  it("exibe Instagram e TikTok Orgânico sem reutilizar métricas de TikTok Ads", () => {
    const source = readFileSync(
      new URL("./SocialOrganicDashboard.tsx", import.meta.url),
      "utf8",
    );
    expect(source).toContain('data-testid="social-organic-platform-instagram"');
    expect(source).toContain('data-testid="social-organic-platform-tiktok"');
    expect(source).toContain('setPlatform("tiktok")');
    expect(source).toContain("videoUnavailableDescription");
    expect(source).not.toContain("trpc.tiktokAds.data");
  });

  it("inclui ranking por alcance e engajamento com fallback de miniatura", () => {
    const source = readFileSync(
      new URL("./SocialOrganicDashboard.tsx", import.meta.url),
      "utf8",
    );
    expect(source).toContain('type ContentSort = "reach" | "engagements"');
    expect(source).toContain("content.thumbnailUrl");
    expect(source).toContain("onError={() => setFailed(true)}");
    expect(source).toContain("object-contain");
    expect(source).not.toContain("object-cover");
    expect(source).toContain("Miniatura indisponível");
  });
});
