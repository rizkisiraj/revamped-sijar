import Link from 'next/link';
import MountainCanvas from '~/components/MountainCanvas';
import { getPosts } from '~/helpers/getPosts';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default async function HomePage() {
  const recentPosts = getPosts().slice(0, 3);
  return (
    <div className="flex flex-col gap-12">

      {/* Hero */}
      <section className="animate-fade-up pt-10 pb-12">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-4.5 font-mono text-[0.75rem] text-muted uppercase tracking-[0.08em]">
          <span className="inline-block w-4.5 h-px bg-muted shrink-0" />
          SOFTWARE ENGINEER
        </div>

        <h1 className="text-[1.75rem] font-semibold tracking-[-0.03em] leading-[1.2] mb-4">
          Rizki Siraj
        </h1>

        <p className="text-[0.95rem] text-fg-2 max-w-[560px] leading-[1.8] mb-7">
          Hey! I&apos;m a software engineer passionate about mobile development — Kotlin, SwiftUI,
          and React are my go-tos. Aside from building things, I write about what I learn.
          Mostly technical, always honest.
        </p>

        <div className="flex gap-[10px] flex-wrap">
          <Link
            href="/blog"
            className="btn-primary inline-flex items-center px-[14px] py-2 rounded-md text-[0.85rem] font-medium bg-fg text-bg border border-fg no-underline transition-opacity duration-150"
          >
            Read articles
          </Link>
          <Link
            href="/projects"
            className="btn-secondary inline-flex items-center px-[14px] py-2 rounded-md text-[0.85rem] font-medium bg-card text-fg border border-border no-underline transition-all duration-150"
          >
            View projects
          </Link>
        </div>
      </section>

      {/* Canvas Animation */}
      <section className="animate-fade-up-2 hidden sm:block">
        <MountainCanvas />
      </section>

      {/* Recent Articles */}
      <section className="animate-fade-up-3">
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono text-[0.7rem] text-muted uppercase tracking-[0.08em]">
            Recent articles
          </span>
          <Link href="/blog" className="see-all text-[0.8rem] text-muted no-underline transition-colors duration-150">
            All articles →
          </Link>
        </div>

        <ul className="list-none">
          {recentPosts.map((post, i) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                aria-label={`Read: ${post.title}`}
                className={[
                  'post-row flex justify-between items-baseline gap-4 py-[14px] border-b border-border no-underline',
                  i === 0 ? 'border-t border-border' : '',
                ].join(' ')}
              >
                <span className="post-title text-[0.9rem] font-medium text-fg-2 transition-colors duration-150">
                  {post.title}
                </span>
                <span className="font-mono text-[0.72rem] text-muted whitespace-nowrap shrink-0">
                  {formatDate(post.date)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Status */}
      <section className="animate-fade-up-4 flex items-center gap-2">
        <span
          aria-hidden="true"
          className="inline-block size-[6px] rounded-full bg-green shrink-0 animate-pulse-dot"
        />
        <span className="text-[0.88rem] text-muted">
          Available for work —{' '}
          <Link href="/links" className="text-muted underline underline-offset-[3px]">
            say hello
          </Link>
        </span>
      </section>
    </div>
  );
}
