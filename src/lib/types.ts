// Last.fm types
export type NowPlaying = {
  isPlaying: boolean;
  title: string;
  artist: string;
  albumArt: string | null;
} | null;

export type TopTrack = {
  rank: number;
  title: string;
  artist: string;
  plays: number;
  albumArt: string | null;
};

export type LastFmResponse = {
  nowPlaying: NowPlaying;
  topTracks: TopTrack[];
};

// WakaTime types
export type LanguageStat = {
  name: string;
  pct: number;
};

export type WakaTimeResponse = {
  totalHours: string;
  topLanguage: string;
  languages: LanguageStat[];
};

// LeetCode types
export type LeetCodeResponse = {
  solved: number | null;
  easySolved: number | null;
  mediumSolved: number | null;
  hardSolved: number | null;
};

// Content types
export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  tag: string;
  description: string;
  lang?: string;
};

export type Post = PostMeta & { content: string };

export type ProjectMeta = {
  slug: string;
  title: string;
  type: string;
  year: number;
  description: string;
};

export type Project = ProjectMeta & { content: string };
