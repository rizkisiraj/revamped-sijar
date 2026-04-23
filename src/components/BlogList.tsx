'use client';
import Link from 'next/link';
import { useState } from 'react';
import { type PostMeta } from '~/lib/types';

const FILTERS = ['All', 'iOS', 'Machine Learning'] as const;

function TagChip({ tag }: { tag: string }) {
  return (
    <span className="font-mono text-[0.68rem] bg-bg-2 border border-border px-2 py-0.5 rounded text-muted uppercase tracking-[0.04em] inline-block">
      {tag}
    </span>
  );
}

export default function BlogList({ posts }: { posts: PostMeta[] }) {
  const [active, setActive] = useState('All');

  const filtered =
    active === 'All'
      ? posts
      : posts.filter(p => p.tag.toLowerCase() === active.toLowerCase());

  return (
    <div>
      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap mb-8">
        {FILTERS.map(tag => (
          <button
            key={tag}
            onClick={() => setActive(tag)}
            aria-pressed={active === tag}
            className={[
              'font-mono text-[0.72rem] px-3.5 py-1.5 rounded-full border cursor-pointer transition-all duration-150',
              active === tag
                ? 'border-fg bg-fg text-bg font-medium'
                : 'border-border bg-transparent text-muted font-normal',
            ].join(' ')}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Article rows */}
      <div>
        {filtered.map(post => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            aria-label={`Read: ${post.title}`}
            className="blog-row grid grid-cols-[1fr_auto] gap-4 py-3.5 border-b border-border no-underline"
          >
            <div>
              <div className="text-[0.95rem] font-medium text-fg mb-1">
                {post.title}
              </div>
              <div className="text-[0.83rem] text-muted leading-[1.5] mb-2">
                {post.description}
              </div>
              <TagChip tag={post.tag} />
            </div>
            <div className="font-mono text-[0.72rem] text-muted self-start whitespace-nowrap">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric',
              })}
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="text-[0.9rem] text-muted py-6">
            No posts in this category yet.
          </p>
        )}
      </div>
    </div>
  );
}
