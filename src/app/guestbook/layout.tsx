import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Guestbook — Rizki Siraj' };

export default function GuestbookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
