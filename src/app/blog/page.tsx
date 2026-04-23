import type { Metadata } from 'next';
import BlogList from '~/components/BlogList';
import { getPosts } from '~/helpers/getPosts';

export const metadata: Metadata = { title: 'Blog — Rizki Siraj' };

export default function BlogPage() {
  const posts = getPosts();
  return (
    <div className="animate-fade-up">
      <h1 className="text-[1.75rem] font-semibold tracking-[-0.03em] mb-2">
        Writing
      </h1>
      <p className="text-[0.95rem] text-muted mb-8">
        Thoughts on mobile development, web, and software architecture.
      </p>
      <BlogList posts={posts} />
    </div>
  );
}
