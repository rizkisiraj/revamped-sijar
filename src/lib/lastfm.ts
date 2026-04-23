import { env } from "~/env";

const LASTFM_BASE = "https://ws.audioscrobbler.com/2.0/";

function url(params: Record<string, string>) {
  const p = new URLSearchParams({
    ...params,
    api_key: env.LASTFM_API_KEY,
    user: env.LASTFM_USERNAME,
    format: "json",
  });
  return `${LASTFM_BASE}?${p.toString()}`;
}

export async function getNowPlaying() {
  try {
    const res = await fetch(url({ method: "user.getRecentTracks", limit: "1" }), {
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const data = await res.json() as {
      recenttracks: {
        track: {
          name: string;
          artist: { "#text": string };
          image: { "#text": string; size: string }[];
          "@attr"?: { nowplaying: string };
        }[];
      };
    };
    const track = data.recenttracks.track[0];
    if (!track) return null;
    const isPlaying = track["@attr"]?.nowplaying === "true";
    return {
      isPlaying,
      title: track.name,
      artist: track.artist["#text"],
      albumArt: track.image.find(i => i.size === "large")?.["#text"] ?? null,
    };
  } catch {
    return null;
  }
}

export async function getTopTracks(limit = 5) {
  try {
    const res = await fetch(
      url({ method: "user.getTopTracks", period: "1month", limit: String(limit) })
    );
    if (!res.ok) return [];
    const data = await res.json() as {
      toptracks: {
        track: {
          name: string;
          artist: { name: string };
          playcount: string;
          image: { "#text": string; size: string }[];
        }[];
      };
    };
    return data.toptracks.track.map((track, i) => ({
      rank: i + 1,
      title: track.name,
      artist: track.artist.name,
      plays: parseInt(track.playcount, 10),
      albumArt: track.image.find(i => i.size === "large")?.["#text"] ?? null,
    }));
  } catch {
    return [];
  }
}
