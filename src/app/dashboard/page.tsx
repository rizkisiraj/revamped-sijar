'use client';

import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '~/lib/fetcher';
import {
  type LastFmResponse,
  type WakaTimeResponse,
  type LeetCodeResponse,
  type TopTrack,
  type LanguageStat,
} from '~/lib/types';

/* ── Animated music bars ── */
function MusicBars() {
  return (
    <div className="flex items-end gap-0.5 h-3.5" aria-hidden="true">
      {[0, 0.15, 0.3, 0.45].map((delay, i) => (
        <div
          key={i}
          className="music-bar"
          style={{ animationDelay: `${delay}s`, height: 3 }}
        />
      ))}
    </div>
  );
}

/* ── Language bar (animates width on mount) ── */
function LanguageBar({ name, pct, delay }: { name: string; pct: number; delay: number }) {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = setTimeout(() => {
      el.style.transition = prefersReduced ? 'none' : 'width 0.8s cubic-bezier(0.22,1,0.36,1)';
      el.style.width = `${pct}%`;
    }, delay);
    return () => clearTimeout(t);
  }, [pct, delay]);

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[0.72rem] text-fg-2 w-20 shrink-0">{name}</span>
      <div className="flex-1 h-1.25 rounded-full bg-bg-2 overflow-hidden">
        <div
          ref={fillRef}
          style={{ width: 0, backgroundColor: 'var(--color-fg)' }}
          className="h-full rounded-full"
        />
      </div>
      <span className="font-mono text-[0.68rem] text-muted w-8 text-right shrink-0">{pct}%</span>
    </div>
  );
}

export default function DashboardPage() {
  const { data: spotifyData, isLoading: spotifyLoading } = useQuery<LastFmResponse>({
    queryKey: ['lastfm'],
    queryFn: () => fetcher<LastFmResponse>('/api/lastfm'),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    refetchInterval: 60_000,
  });

  const { data: leetcodeData, isLoading: leetcodeLoading } = useQuery<LeetCodeResponse>({
    queryKey: ['leetcode'],
    queryFn: () => fetcher<LeetCodeResponse>('/api/leetcode'),
    staleTime: 3_600_000,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const { data: wakaData, isLoading: wakaLoading } = useQuery<WakaTimeResponse>({
    queryKey: ['wakatime'],
    queryFn: () => fetcher<WakaTimeResponse>('/api/wakatime'),
    staleTime: 3_600_000,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const nowPlaying = spotifyData?.nowPlaying;
  const topTracks  = (spotifyData?.topTracks ?? []) as TopTrack[];
  const leetcodeSolved = leetcodeData?.solved;
  const codingHours = wakaData?.totalHours;
  const topLanguage = wakaData?.topLanguage;
  const languages   = (wakaData?.languages ?? []) as LanguageStat[];

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="animate-fade-up">
        <div className="flex items-center gap-2 mb-4 font-mono text-[0.75rem] text-muted uppercase tracking-[0.08em]">
          <span className="inline-block w-4 h-px bg-muted shrink-0" />
          Dashboard
        </div>
        <h1 className="text-[1.75rem] font-semibold tracking-[-0.03em] leading-[1.2]">
          By the numbers
        </h1>
        <p className="text-[0.95rem] text-fg-2 leading-[1.8] mt-2 max-w-140">
          A live snapshot of my coding activity and listening habits.
        </p>
      </div>

      {/* Stat cards */}
      <section className="animate-fade-up-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Coding this week', value: codingHours,    sub: 'via WakaTime', loading: wakaLoading },
            { label: 'Top language',     value: topLanguage,    sub: 'last 7 days',  loading: wakaLoading },
            { label: 'LeetCode solved',  value: leetcodeSolved, sub: 'all time',     loading: leetcodeLoading },
          ].map(stat => {
            const labelId = `stat-label-${stat.label.replace(/\s+/g, '-').toLowerCase()}`;
            return (
              <div key={stat.label} className="border border-border rounded-lg bg-card p-5">
                <p id={labelId} className="font-mono text-[0.68rem] text-muted uppercase tracking-[0.06em] mb-3">
                  {stat.label}
                </p>
                {stat.loading ? (
                  <div className="w-16 h-6 rounded bg-bg-2 animate-pulse" />
                ) : (
                  <p aria-labelledby={labelId} className="text-[2rem] font-semibold tracking-[-0.04em] leading-none">
                    {stat.value ?? '—'}
                  </p>
                )}
                <p className="text-[0.78rem] text-muted mt-1">{stat.sub}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Now Playing */}
      <section className="animate-fade-up-3">
        <h2 className="font-mono text-[0.7rem] text-muted uppercase tracking-[0.08em] mb-4">
          Now Playing
        </h2>
        <div className="border border-border rounded-lg bg-card p-4">
          {spotifyLoading ? (
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-sm bg-bg-2 animate-pulse shrink-0" />
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <div className="w-40 h-3 rounded bg-bg-2 animate-pulse" />
                <div className="w-24 h-3 rounded bg-bg-2 animate-pulse" />
              </div>
            </div>
          ) : nowPlaying?.isPlaying ? (
            <div className="flex items-center gap-3">
              {nowPlaying.albumArt ? (
                <img src={nowPlaying.albumArt} alt={`${nowPlaying.title} album cover`} className="size-11 rounded-sm shrink-0 object-cover" />
              ) : (
                <div className="size-11 rounded-sm bg-bg-2 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[0.88rem] font-medium text-fg truncate">{nowPlaying.title}</p>
                <p className="text-[0.78rem] text-muted truncate">{nowPlaying.artist}</p>
              </div>
              <MusicBars />
              <span className="font-mono text-[0.68rem] text-muted shrink-0">Last.fm</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-muted">
              <div className="size-11 rounded-sm bg-bg-2 shrink-0" />
              <p className="text-[0.88rem]">Not playing</p>
            </div>
          )}
        </div>
      </section>

      {/* Top 5 Songs */}
      <section className="animate-fade-up-4">
        <h2 className="font-mono text-[0.7rem] text-muted uppercase tracking-[0.08em] mb-4">
          Top Songs This Month
        </h2>
        <ul className="list-none">
          {spotifyLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <li
                key={i}
                className={[
                  'flex items-center gap-3 py-3 border-b border-border',
                  i === 0 ? 'border-t border-border' : '',
                ].join(' ')}
              >
                <div className="w-4 h-3 rounded bg-bg-2 animate-pulse shrink-0" />
                <div className="size-8.5 rounded-[3px] bg-bg-2 animate-pulse shrink-0" />
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <div className="w-36 h-3 rounded bg-bg-2 animate-pulse" />
                  <div className="w-24 h-3 rounded bg-bg-2 animate-pulse" />
                </div>
              </li>
            ))
          ) : topTracks.length === 0 ? (
            <li className="py-3 border-t border-border">
              <p className="font-mono text-[0.78rem] text-muted italic">No tracks available</p>
            </li>
          ) : (
            topTracks.map((song, i) => (
              <li
                key={song.rank}
                className={[
                  'flex items-center gap-3 py-3 border-b border-border',
                  i === 0 ? 'border-t border-border' : '',
                ].join(' ')}
              >
                <span className="font-mono text-[0.72rem] text-muted w-4 shrink-0 text-right">
                  {song.rank}
                </span>
                {song.albumArt ? (
                  <img src={song.albumArt} alt={`${song.title} album cover`} className="size-8.5 rounded-[3px] shrink-0 object-cover" />
                ) : (
                  <div className="size-8.5 rounded-[3px] bg-bg-2 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[0.85rem] font-medium text-fg truncate">{song.title}</p>
                  <p className="text-[0.75rem] text-muted truncate">{song.artist}</p>
                </div>
                <span className="font-mono text-[0.68rem] text-muted shrink-0">{song.plays}</span>
              </li>
            ))
          )}
        </ul>
      </section>

      {/* Language chart */}
      <section className="animate-fade-up-4" style={{ animationDelay: '0.32s' }}>
        <h2 className="font-mono text-[0.7rem] text-muted uppercase tracking-[0.08em] mb-4">
          Languages
        </h2>
        <div className="flex flex-col gap-3">
          {wakaLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-20 h-3 rounded bg-bg-2 animate-pulse shrink-0" />
                <div className="flex-1 h-1.25 rounded-full bg-bg-2 animate-pulse" />
                <div className="w-8 h-3 rounded bg-bg-2 animate-pulse shrink-0" />
              </div>
            ))
          ) : languages.length === 0 ? (
            <p className="font-mono text-[0.78rem] text-muted italic">No language data</p>
          ) : (
            languages.map((lang, i) => (
              <LanguageBar key={lang.name} name={lang.name} pct={lang.pct} delay={i * 100 + 200} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
