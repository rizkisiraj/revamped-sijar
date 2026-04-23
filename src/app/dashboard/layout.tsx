import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard — Rizki Siraj' };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
