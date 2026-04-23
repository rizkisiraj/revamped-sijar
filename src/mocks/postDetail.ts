export const mockPost = {
  slug: 'nextjs-app-router-patterns',
  title: 'Next.js App Router Patterns',
  date: '2025-01-10',
  tag: 'web',
  description: 'Practical patterns for data fetching, caching, and layouts in the App Router.',
  content: `
## Introduction

The App Router in Next.js 14 changes how we think about data fetching. Instead of \`getStaticProps\` and \`getServerSideProps\`, we use async Server Components that can fetch data directly.

\`\`\`ts
// Before (Pages Router)
export async function getStaticProps() {
  const data = await fetchPosts();
  return { props: { data } };
}

// After (App Router)
export default async function Page() {
  const data = await fetchPosts(); // runs on server
  return <PostList posts={data} />;
}
\`\`\`

## Caching Strategy

Next.js 14 caches \`fetch\` calls by default. You opt out with \`cache: 'no-store'\` or revalidate with \`next: { revalidate: 60 }\`.

> The key insight: caching is per-request by default in the App Router, not per-build. This makes it much easier to reason about freshness.

## Layout Nesting

Layouts in App Router are persistent — they don't remount between navigations. This is great for:

- Preserving scroll position
- Keeping sidebar state
- Avoiding layout flicker

\`\`\`tsx
// src/app/blog/layout.tsx
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
\`\`\`

## Conclusion

The App Router is a significant improvement once you understand the mental model shift from request-time to component-time data fetching.
  `.trim(),
};
