export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  tag: 'android' | 'ios' | 'web' | 'architecture';
  description: string;
};

export const mockRecentPosts: PostMeta[] = [
  {
    slug: 'jetpack-compose-side-effects',
    title: 'Jetpack Compose Side Effects Explained',
    date: '2025-03-15',
    tag: 'android',
    description: 'A practical guide to LaunchedEffect, SideEffect, and DisposableEffect in Compose.',
  },
  {
    slug: 'swiftui-animation-deep-dive',
    title: 'SwiftUI Animation Deep Dive',
    date: '2025-02-28',
    tag: 'ios',
    description: 'Exploring withAnimation, matchedGeometryEffect, and custom transitions in SwiftUI.',
  },
  {
    slug: 'nextjs-app-router-patterns',
    title: 'Next.js App Router Patterns',
    date: '2025-01-10',
    tag: 'web',
    description: 'Practical patterns for data fetching, caching, and layouts in the App Router.',
  },
];

export const mockAllPosts: PostMeta[] = [
  ...mockRecentPosts,
  {
    slug: 'clean-architecture-android',
    title: 'Clean Architecture on Android',
    date: '2024-12-05',
    tag: 'architecture',
    description: 'Structuring Android apps with Use Cases, Repositories, and dependency inversion.',
  },
  {
    slug: 'swiftdata-cloudkit',
    title: 'SwiftData + CloudKit Sync',
    date: '2024-11-20',
    tag: 'ios',
    description: 'Setting up automatic iCloud sync with SwiftData in iOS 17.',
  },
  {
    slug: 'react-server-components',
    title: 'React Server Components in Practice',
    date: '2024-10-14',
    tag: 'web',
    description: 'What RSC changes about data fetching, bundling, and component design.',
  },
  {
    slug: 'modularising-android',
    title: 'Modularising Your Android App',
    date: '2024-09-03',
    tag: 'architecture',
    description: 'Feature modules, build time improvements, and Gradle best practices.',
  },
  {
    slug: 'coroutines-flow',
    title: 'Kotlin Coroutines & Flow',
    date: '2024-08-18',
    tag: 'android',
    description: 'Cold flows, hot flows, StateFlow, SharedFlow — when to use each.',
  },
];
