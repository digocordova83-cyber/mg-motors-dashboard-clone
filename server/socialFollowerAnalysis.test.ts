import { describe, expect, it } from "vitest";
import { buildFollowerAnalysis } from "./socialFollowerAnalysis";

function daily(date: string, newFollowers: number, multiplier = 1) {
  return {
    date,
    newFollowers,
    dailyReach: newFollowers * 100 * multiplier,
    interactions: newFollowers * 10 * multiplier,
    views: newFollowers * 200 * multiplier,
  };
}

describe("análise de crescimento de seguidores", () => {
  it("compara dias úteis e fins de semana e detecta um fim de semana fora da curva", () => {
    const data = [
      daily("2026-08-24", 10),
      daily("2026-08-25", 10),
      daily("2026-08-29", 20),
      daily("2026-08-30", 20),
      daily("2026-08-31", 10),
      daily("2026-09-01", 10),
      daily("2026-09-05", 20),
      daily("2026-09-06", 20),
      daily("2026-09-07", 10),
      daily("2026-09-08", 10),
      daily("2026-09-12", 20),
      daily("2026-09-13", 20),
      daily("2026-09-14", 10),
      daily("2026-09-15", 10),
      daily("2026-09-19", 50, 2),
      daily("2026-09-20", 50, 2),
    ];
    const contents = [
      {
        id: "post-spike",
        timestamp: "2026-09-18T18:00:00+0000",
        caption: "Conteúdo relacionado ao pico",
        thumbnailUrl: "https://cdn.example.com/spike.jpg",
        permalink: "https://instagram.com/p/spike",
        reach: 9_000,
        engagements: 900,
        follows: 12,
      },
    ];

    const analysis = buildFollowerAnalysis(data, contents, "instagram");

    expect(analysis.weekday).toMatchObject({ average: 10, median: 10 });
    expect(analysis.weekend).toMatchObject({ days: 8, total: 220, average: 27.5 });
    expect(analysis.weekendVsWeekdayPercent).toBe(175);
    expect(analysis.latestWeekend).toMatchObject({
      dateFrom: "2026-09-19",
      dateTo: "2026-09-20",
      complete: true,
      status: "spike",
      followerTotal: 100,
      benchmarkDailyAverage: 20,
      followerDifferencePercent: 150,
    });
    expect(analysis.latestWeekend?.relatedContents[0]).toMatchObject({
      id: "post-spike",
      relationship: "lead-in",
    });
    expect(analysis.benchmark).toMatchObject({
      completedWeekendCount: 3,
      weekendTotalMedian: 40,
    });
    expect(analysis.confidence).toBe("medium");
  });

  it("marca como em apuração a última data com zero seguidores e atividade orgânica", () => {
    const data = [
      daily("2026-09-05", 40),
      daily("2026-09-06", 35),
      daily("2026-09-12", 45),
      daily("2026-09-13", 40),
      daily("2026-09-19", 60),
      { ...daily("2026-09-20", 0), dailyReach: 900, views: 6_000, interactions: 100 },
    ];

    const analysis = buildFollowerAnalysis(data, [], "instagram");

    expect(analysis.dataQuality).toEqual({
      reliableThroughDate: "2026-09-19",
      pendingDates: ["2026-09-20"],
      complete: false,
    });
    expect(analysis.latestWeekend).toMatchObject({
      status: "pending",
      complete: false,
      reportedFollowerDays: 1,
      followerTotal: 60,
      pendingDates: ["2026-09-20"],
    });
  });

  it("não marca zeros finais do TikTok como pendentes porque a métrica é crescimento líquido", () => {
    const analysis = buildFollowerAnalysis(
      [
        daily("2026-09-19", 5),
        { ...daily("2026-09-20", 0), dailyReach: 500, views: 800 },
      ],
      [],
      "tiktok",
    );

    expect(analysis.dataQuality.pendingDates).toEqual([]);
    expect(analysis.latestWeekend?.complete).toBe(true);
  });
});
