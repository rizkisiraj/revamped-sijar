import type { Metadata } from 'next';
import { DM_Sans, DM_Mono } from 'next/font/google';
import Nav from '~/components/Nav';
import SessionProvider from '~/components/SessionProvider';
import { TRPCReactProvider } from '~/trpc/client';
import '~/styles/globals.css';

// Use distinct variable names so @theme can reference them without circular deps
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Rizki Siraj — Software Engineer',
  description: 'Software engineer specialising in mobile development (Kotlin, SwiftUI) and web (React).',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${dmMono.variable} font-sans`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-fg focus:text-bg focus:rounded-md"
        >
          Skip to content
        </a>
        <TRPCReactProvider>
        <SessionProvider>
        <Nav />
        <main
          id="main-content"
          className="max-w-[720px] mx-auto px-6 pt-[calc(60px+48px)] pb-20"
        >
          {children}
        </main>
        </SessionProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
