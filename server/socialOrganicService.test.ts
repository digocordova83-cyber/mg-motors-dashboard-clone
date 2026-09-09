import { describe, expect, it } from "vitest";
import {
  buildMetricComparison,
  buildSocialOrganicData,
  normalizeOrganicMedia,
  normalizeTikTokDailySourceRows,
  normalizeTikTokMediaSourceRows,
  resolveSocialOrganicComparisonPeriod,
} from "./socialOrganicService";

describe("Social Orgânico", () => {
  it("resolve o período anterior equivalente sem sobreposição", () => {
    expect(resolveSocialOrganicComparisonPeriod("2026-09-01", "2026-09-07")).toMatchObject({
      dateFrom: "2026-09-01",
      dateTo: "2026-09-07",
      days: 7,
      previousDateFrom: "2026-08-25",
      previousDateTo: "2026-08-31",
    });
  });

  it("mantém diferença absoluta e evita percentual infinito quando a base anterior é zero", () => {
    expect(buildMetricComparison(12, 0)).toEqual({
      current: 12,
      previous: 0,
      absoluteChange: 12,
      percentChange: null,
    });
    expect(buildMetricComparison(0, 0).percentChange).toBe(0);
    expect(buildMetricComparison(null, 10).absoluteChange).toBeNull();
  });

  it("deduplica conteúdos por media_id e seleciona somente miniaturas válidas", () => {
    const contents = normalizeOrganicMedia([
      {
        media_id: "post-1",
        timestamp: "2026-09-01T12:00:00+0000",
        media_caption: "Primeiro conteúdo",
        media_thumbnail_url: "javascript:invalid",
        media_url: "https://cdn.example.com/post-1.jpg",
        media_reach: 100,
        media_engagement: 20,
      },
      {
        media_id: "post-1",
        media_reach: 90,
        media_engagement: 18,
      },
      {
        media_id: "post-2",
        media_thumbnail_url: "not-a-url",
        media_reach: 50,
        media_engagement: 10,
      },
    ]);

    expect(contents).toHaveLength(2);
    expect(contents[0]).toMatchObject({
      id: "post-1",
      thumbnailUrl: "https://cdn.example.com/post-1.jpg",
      engagementRate: 20,
    });
    expect(contents[1].thumbnailUrl).toBeNull();
  });

  it("reconcilia métricas atuais e anteriores sem chamar novos seguidores de crescimento líquido", () => {
    const data = buildSocialOrganicData(
      {
        currentDaily: [
          {
            date: "2026-09-01",
            follower_count_1d: 10,
            reach_1d: 100,
            total_interactions: 10,
            accounts_engaged: 8,
            likes: 6,
            comments: 1,
            saves: 1,
            shares: 2,
            views: 200,
          },
          {
            date: "2026-09-02",
            follower_count_1d: 5,
            reach_1d: 200,
            total_interactions: 20,
            accounts_engaged: 16,
            likes: 12,
            comments: 2,
            saves: 2,
            shares: 4,
            views: 400,
          },
        ],
        previousDaily: [
          {
            date: "2026-08-30",
            follower_count_1d: 2,
            reach_1d: 100,
            total_interactions: 5,
            views: 150,
          },
          {
            date: "2026-08-31",
            follower_count_1d: 2,
            reach_1d: 100,
            total_interactions: 5,
            views: 150,
          },
        ],
        currentMedia: [
          {
            media_id: "post-1",
            timestamp: "2026-09-01T12:00:00+0000",
            media_caption: "Conteúdo líder",
            media_reach: 500,
            media_engagement: 50,
            media_follows: 4,
          },
        ],
        previousMedia: [],
        profile: [
          {
            account_id: "28842093312063059",
            username: "mgmotorbrasil",
            followers_count: 50_000,
            media_count: 132,
          },
        ],
      },
      { updatedAt: "2026-09-08T12:00:00.000Z", cacheHit: false },
      "2026-09-01",
      "2026-09-02",
    );

    expect(data.summary).toMatchObject({
      newFollowers: 15,
      dailyReach: 300,
      interactions: 30,
      engagementRate: 10,
      views: 600,
    });
    expect(data.previousSummary.engagementRate).toBe(5);
    expect(data.comparisons.newFollowers).toMatchObject({
      absoluteChange: 11,
      percentChange: 275,
    });
    expect(data.comparisons.engagementRate.percentChange).toBe(100);
    expect(data.account.followersCurrent).toBe(50_000);
    expect(data.highlights.topByFollows?.id).toBe("post-1");
    expect(data.connection.tiktok.status).toBe("connected");
    expect(data.metadata.definitions.newFollowers).toContain("não representa crescimento líquido");
    expect(data.metadata.definitions.dailyReach).toContain("não representa alcance único deduplicado");
  });

  it("normaliza TikTok Orgânico sem misturar dados pagos e preserva crescimento líquido", () => {
    const daily = normalizeTikTokDailySourceRows([
      {
        account_id: "_000Yp1HuE6qKa98yQHXTVpA29y_auJ0C49W",
        date: "2026-09-01",
        daily_total_followers: 45,
        followers_count: 85,
        daily_lost_followers: 40,
        unique_video_views: 19_132,
        video_views: 20_082,
        engaged_audience: 187,
        likes: 133,
        comments: 2,
        shares: 12,
        profile_views: 173,
      },
      { account_id: "conta-estranha", date: "2026-09-01", daily_total_followers: 999 },
    ]);

    expect(daily).toEqual([
      expect.objectContaining({
        follower_count_1d: 45,
        reach_1d: 19_132,
        views: 20_082,
        total_interactions: 147,
        accounts_engaged: 187,
        profile_views: 173,
      }),
    ]);

    const media = normalizeTikTokMediaSourceRows([
      {
        account_id: "_000Yp1HuE6qKa98yQHXTVpA29y_auJ0C49W",
        video_id: "video-1",
        video_thumbnail_url: "https://cdn.example.com/tiktok.jpg",
        video_share_url: "https://www.tiktok.com/@mg/video/1",
        video_reach: 1_000,
        video_views_count: 1_200,
        video_likes: 80,
        video_comments: 4,
        video_shares: 8,
        video_favorites: 3,
      },
      {
        account_id: "_000Yp1HuE6qKa98yQHXTVpA29y_auJ0C49W",
        video_id: null,
      },
    ]);

    expect(media).toEqual([
      expect.objectContaining({
        media_id: "video-1",
        media_reach: 1_000,
        media_views: 1_200,
        media_engagement: 95,
        media_thumbnail_url: "https://cdn.example.com/tiktok.jpg",
      }),
    ]);
  });

  it("mantém interações diárias do TikTok quando o Windsor ainda não retorna vídeos", () => {
    const data = buildSocialOrganicData(
      {
        currentDaily: [
          {
            date: "2026-09-01",
            follower_count_1d: 45,
            reach_1d: 19_132,
            total_interactions: 147,
            accounts_engaged: 187,
            likes: 133,
            comments: 2,
            shares: 12,
            profile_views: 173,
            views: 20_082,
          },
        ],
        previousDaily: [],
        currentMedia: [],
        previousMedia: [],
        profile: [
          {
            account_id: "_000Yp1HuE6qKa98yQHXTVpA29y_auJ0C49W",
            account_name: "MG Motor Brasil",
            followers_count: 117_511,
            media_count: 384,
          },
        ],
      },
      { updatedAt: "2026-09-08T12:00:00.000Z", cacheHit: false },
      "2026-09-01",
      "2026-09-01",
      "tiktok",
    );

    expect(data.platform).toBe("tiktok");
    expect(data.summary).toMatchObject({
      newFollowers: 45,
      dailyReach: 19_132,
      interactions: 147,
      likes: 133,
      comments: 2,
      shares: 12,
      profileViews: 173,
    });
    expect(data.contents).toEqual([]);
    expect(data.account.followersCurrent).toBe(117_511);
    expect(data.metadata.definitions.newFollowers).toContain("Crescimento líquido");
  });
});
