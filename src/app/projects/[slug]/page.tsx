import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { getProject } from '~/helpers/getProject';
import { getProjects } from '~/helpers/getProjects';

export async function generateStaticParams() {
  return getProjects().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: `${project.title} — Rizki Siraj` };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <article className="max-w-[660px] animate-fade-up">
      {/* Back link */}
      <Link href="/projects" className="back-link text-[0.82rem] text-muted no-underline inline-block mb-6">
        ← Back to projects
      </Link>

      {/* Meta row */}
      <div className="flex items-center gap-2.5 mb-4">
        <span className="font-mono text-[0.68rem] bg-bg-2 border border-border px-2 py-0.5 rounded uppercase text-muted tracking-[0.04em]">
          {project.type}
        </span>
        <span className="font-mono text-[0.72rem] text-muted">{project.year}</span>
      </div>

      {/* Title */}
      <h1 className="text-[2rem] font-semibold tracking-[-0.03em] leading-[1.2] mb-3">
        {project.title}
      </h1>

      {/* Description */}
      <p className="text-[0.95rem] text-muted leading-[1.7] mb-7">
        {project.description}
      </p>

      <div className="h-px bg-border mb-8" />

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
            ul: ({ children }) => (
              <ul className="list-disc pl-6 mb-[1em]">{children}</ul>
            ),
            li: ({ children }) => (
              <li className="list-item mb-1">{children}</li>
            ),
          }}
        >
          {project.content}
        </ReactMarkdown>
      </div>

      {/* Footer */}
      <div className="flex gap-3 mt-12 pt-8 border-t border-border">
        <Link
          href="/projects"
          className="border border-border text-fg-2 px-4 py-2 rounded-md text-[0.88rem] no-underline"
        >
          ← All projects
        </Link>
      </div>
    </article>
  );
}
