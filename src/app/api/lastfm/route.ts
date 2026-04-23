import { NextResponse } from "next/server";
import { getNowPlaying, getTopTracks } from "~/lib/lastfm";

export const revalidate = 60;

export async function GET() {
  try {
    const [nowPlaying, topTracks] = await Promise.all([
      getNowPlaying(),
      getTopTracks(5),
    ]);
    return NextResponse.json({ nowPlaying, topTracks }, {
      headers: { "Cache-Control": "s-maxage=90, stale-while-revalidate=180" },
    });
  } catch {
    return NextResponse.json({ nowPlaying: null, topTracks: [] }, {
      headers: { "Cache-Control": "no-store" },
    });
  }
}
