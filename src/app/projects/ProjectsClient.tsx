'use client';

import { useState } from 'react';
import Link from 'next/link';
import { type ProjectMeta } from '~/lib/types';

type FilterType = 'all' | 'android' | 'ios' | 'web';

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'All',     value: 'all'     },
  { label: 'Android', value: 'android' },
  { label: 'iOS',     value: 'ios'     },
  { label: 'Web',     value: 'web'     },
];

function ProjectCard({ project }: { project: ProjectMeta }) {
  return (
    <div className="project-card h-full flex flex-col border border-border rounded-[8px] overflow-hidden bg-card transition-all duration-[150ms,200ms] hover:-translate-y-[2px] hover:border-border-2">
      {/* Thumbnail */}
      <div className="aspect-video bg-bg-2 border-b border-border relative flex items-center justify-center overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 8px,
              color-mix(in srgb, var(--color-border) 60%, transparent) 8px,
              color-mix(in srgb, var(--color-border) 60%, transparent) 9px
            )`,
          }}
        />
        <span aria-hidden="true" className="relative font-mono text-[0.7rem] text-center leading-[1.5] px-2" style={{ color: 'var(--color-border-2)' }}>
          {project.title}<br />screenshot
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-[6px]">
        <p className="text-[0.92rem] font-semibold text-fg leading-snug">{project.title}</p>
        <p className="text-[0.82rem] text-muted leading-[1.55] flex-1">{project.description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-[10px]">
          <span className="font-mono text-[0.68rem] text-muted bg-bg-2 border border-border px-2 py-[3px] rounded-[4px]">
            {project.type}
          </span>
          <span className="font-mono text-[0.68rem] text-muted">{project.year}</span>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsClient({ projects }: { projects: ProjectMeta[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filtered = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.type === activeFilter);

  return (
    <div className="flex flex-col gap-8 animate-fade-up">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-4 font-mono text-[0.75rem] text-muted uppercase tracking-[0.08em]">
          <span className="inline-block w-4 h-px bg-muted shrink-0" />
          Projects
        </div>
        <h1 className="text-[1.75rem] font-semibold tracking-[-0.03em] leading-[1.2]">
          Things I&apos;ve built
        </h1>
        <p className="text-[0.95rem] text-fg-2 leading-[1.8] mt-2 max-w-[560px]">
          A mix of mobile apps, web projects, and experiments.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 flex-wrap animate-fade-up-2">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            aria-pressed={activeFilter === f.value}
            className={[
              'font-mono text-[0.72rem] px-3 py-1 rounded-full border transition-colors duration-150',
              activeFilter === f.value
                ? 'bg-fg text-bg border-fg'
                : 'bg-transparent text-muted border-border hover:border-border-2',
            ].join(' ')}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div
        className="animate-fade-up-3"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
          maxWidth: '960px',
        }}
      >
        {filtered.map(project => (
          <Link key={project.slug} href={`/projects/${project.slug}`} className="no-underline block h-full">
            <ProjectCard project={project} />
          </Link>
        ))}
      </div>
    </div>
  );
}
