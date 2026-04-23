export type ProjectMeta = {
  slug: string;
  title: string;
  type: 'android' | 'ios' | 'web';
  year: number;
  desc: string;
};

export const mockProjects: ProjectMeta[] = [
  { slug: 'kasa',      title: 'Kasa',      type: 'android', year: 2024, desc: 'Personal finance tracker, Clean Arch + Compose + Room' },
  { slug: 'lune',      title: 'Lune',      type: 'ios',     year: 2024, desc: 'Mood & journal app, SwiftUI, minimal UX' },
  { slug: 'codemarks', title: 'Codemarks', type: 'web',     year: 2023, desc: 'Browser ext + web app for code snippets, React' },
  { slug: 'pathing',   title: 'Pathing',   type: 'android', year: 2023, desc: 'Navigation prototype, MapLibre + Coroutines' },
  { slug: 'reads',     title: 'Reads',     type: 'ios',     year: 2024, desc: 'Reading list app, iCloud sync, SwiftData' },
  { slug: 'logline',   title: 'Logline',   type: 'web',     year: 2023, desc: 'Minimal note-taking, Next.js + Supabase' },
  { slug: 'pulse',     title: 'Pulse',     type: 'android', year: 2022, desc: 'Health dashboard, step/sleep data' },
  { slug: 'folio',     title: 'Folio',     type: 'web',     year: 2022, desc: 'Portfolio template builder, JSON → static site' },
];
