import { NextResponse } from "next/server";
import { env } from "~/env";

export const revalidate = 3600;

export async function GET() {
  try {
    const key = Buffer.from(env.WAKATIME_API_KEY).toString("base64");
    const res = await fetch(
      "https://wakatime.com/api/v1/users/current/stats/last_7_days",
      {
        headers: { Authorization: `Basic ${key}` },
      }
    );

    if (!res.ok) throw new Error(`WakaTime error: ${res.status}`);

    const json = await res.json() as {
      data: {
        human_readable_total_including_other_language: string;
        languages: { name: string; percent: number }[];
      };
    };

    const { data } = json;
    const languages = (data.languages ?? [])
      .slice(0, 6)
      .map((l) => ({ name: l.name, pct: Math.round(l.percent) }));

    return NextResponse.json({
      totalHours: data.human_readable_total_including_other_language ?? "--",
      topLanguage: languages[0]?.name ?? "--",
      languages,
    }, {
      headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=7200" },
    });
  } catch {
    return NextResponse.json({
      totalHours: "--",
      topLanguage: "--",
      languages: [],
    }, {
      headers: { "Cache-Control": "no-store" },
    });
  }
}
