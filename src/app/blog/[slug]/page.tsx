import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { getPost } from '~/helpers/getPost';
import { getPosts } from '~/helpers/getPosts';

export async function generateStaticParams() {
  return getPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: `${post.title} — Rizki Siraj` };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article lang={post.lang ?? 'en'} className="max-w-[660px] animate-fade-up">
      {/* Back link */}
      <Link href="/blog" className="back-link text-[0.82rem] text-muted no-underline inline-block mb-6">
        ← Back to articles
      </Link>

      {/* Meta row */}
      <div className="flex items-center gap-2.5 mb-4">
        <span className="font-mono text-[0.68rem] bg-bg-2 border border-border px-2 py-0.5 rounded uppercase text-muted tracking-[0.04em]">
          {post.tag}
        </span>
        <span className="font-mono text-[0.72rem] text-muted">
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-[2rem] font-semibold tracking-[-0.03em] leading-[1.2] mb-3">
        {post.title}
      </h1>

      {/* Subtitle */}
      <p className="text-[0.95rem] text-muted leading-[1.7] mb-7">
        {post.description}
      </p>

      {/* Divider row with avatar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-border shrink-0" />
        <div
          aria-label="Rizki Siraj"
          className="size-8 rounded-full bg-bg-2 border border-border flex items-center justify-center font-mono text-[0.7rem] text-muted shrink-0"
        >
          RS
        </div>
        <div className="shrink-0">
          <div className="text-[0.85rem] font-medium">Rizki Siraj</div>
          <div className="font-mono text-[0.72rem] text-muted">
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric',
            })}
          </div>
        </div>
        <div className="flex-1 h-px bg-border shrink-0" />
      </div>

      {/* Prose */}
      <div className="text-[0.95rem] leading-[1.85] text-fg-2">
        <ReactMarkdown
          components={{
            h2: ({ children }) => (
              <h2 className="text-[1.2rem] font-semibold text-fg mt-[2.2em] mb-[0.8em]">
                {children}
              </h2>
            ),
            p: ({ children }) => (
              <p className="mb-[1em]">{children}</p>
            ),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            code: ({ inline, children, ...props }: any) =>
              inline ? (
                <code className="font-mono text-[0.82em] bg-bg-2 border border-border px-[5px] py-px rounded" {...props}>
                  {children}
                </code>
              ) : (
                <code className="font-mono text-[0.85em]" {...props}>
                  {children}
                </code>
              ),
            pre: ({ children }) => (
              <pre className="bg-bg-2 border border-border rounded-lg px-5 py-[18px] overflow-x-auto mb-6">
                {children}
              </pre>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-[3px] border-border-2 pl-4 text-muted italic mb-[1em]">
                {children}
              </blockquote>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-6 mb-[1em]">{children}</ul>
            ),
            li: ({ children }) => (
              <li className="list-item mb-1">{children}</li>
            ),
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Footer */}
      <div className="flex gap-3 mt-12 pt-8 border-t border-border">
        <Link
          href="/blog"
          className="border border-border text-fg-2 px-4 py-2 rounded-md text-[0.88rem] no-underline"
        >
          ← All articles
        </Link>
        <Link
          href="/guestbook"
          className="border border-border text-fg-2 px-4 py-2 rounded-md text-[0.88rem] no-underline"
        >
          Leave a comment
        </Link>
      </div>
    </article>
  );
}
