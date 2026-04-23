export const mockStats = {
  codingHours: '48h 22m',
  topLanguage: 'TypeScript',
  commits: '143',
};

export const mockNowPlaying = {
  isPlaying: true,
  title: 'Blinding Lights',
  artist: 'The Weeknd',
  albumArt: null as string | null,
};

export const mockTopSongs = [
  { rank: 1, title: 'Blinding Lights',  artist: 'The Weeknd', plays: 87, albumArt: null as string | null },
  { rank: 2, title: 'Starboy',          artist: 'The Weeknd', plays: 64, albumArt: null as string | null },
  { rank: 3, title: 'Save Your Tears',  artist: 'The Weeknd', plays: 52, albumArt: null as string | null },
  { rank: 4, title: 'Call Out My Name', artist: 'The Weeknd', plays: 41, albumArt: null as string | null },
  { rank: 5, title: 'Die For You',      artist: 'The Weeknd', plays: 38, albumArt: null as string | null },
];

export const mockLanguages = [
  { name: 'TypeScript', pct: 45 },
  { name: 'Swift',      pct: 28 },
  { name: 'Kotlin',     pct: 14 },
  { name: 'CSS',        pct: 8  },
  { name: 'Other',      pct: 5  },
];
