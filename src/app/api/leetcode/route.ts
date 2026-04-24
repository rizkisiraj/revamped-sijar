import { NextResponse } from "next/server";
import { env } from "~/env";

export const revalidate = 3600;

export async function GET() {
  try {
    const res = await fetch(
      `https://leetcode-api-pied.vercel.app/user/${env.LEETCODE_USERNAME}`
    );

    if (!res.ok) throw new Error(`LeetCode API error: ${res.status}`);

    const json = await res.json() as {
      submitStats: {
        acSubmissionNum: { difficulty: string; count: number }[];
      };
    };

    const ac = json.submitStats.acSubmissionNum;
    const get = (d: string) => ac.find((x) => x.difficulty === d)?.count ?? null;

    return NextResponse.json({
      solved: get('All'),
      easySolved: get('Easy'),
      mediumSolved: get('Medium'),
      hardSolved: get('Hard'),
    }, {
      headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=7200" },
    });
  } catch {
    return NextResponse.json({
      solved: null,
      easySolved: null,
      mediumSolved: null,
      hardSolved: null,
    }, {
      headers: { "Cache-Control": "no-store" },
    });
  }
}
