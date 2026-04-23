'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/',          label: 'Home',      icon: '⌂' },
  { href: '/blog',      label: 'Blog',      icon: '✎' },
  { href: '/projects',  label: 'Projects',  icon: '⊞' },
  { href: '/dashboard', label: 'Dashboard', icon: '◈' },
  { href: '/guestbook', label: 'Guestbook', icon: '✉' },
  { href: '/links',     label: 'Links',     icon: '⇢' },
];

export default function Nav() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const t = stored ?? (prefersDark ? 'dark' : 'light');
    setTheme(t);
    document.documentElement.setAttribute('data-theme', t);
  }, []);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSidebarOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sidebarOpen]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  if (!mounted) return null;

  return (
    <>
      {/* Top nav — always visible */}
      <nav
        id="topNav"
        aria-label="Main navigation"
        className="fixed inset-x-0 top-0 h-[60px] bg-nav backdrop-blur-[12px] border-b border-border z-[100]"
      >
        <div className="max-w-[720px] mx-auto h-full flex items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="font-mono text-[0.85rem] text-fg no-underline tracking-[-0.01em]"
          >
            sijar
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden sm:flex items-center gap-1 list-none">
            {navItems.filter(i => i.href !== '/').map(item => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={[
                    'block text-[0.85rem] no-underline px-[10px] py-[6px] rounded-md transition-colors duration-150',
                    isActive(item.href)
                      ? 'text-fg bg-bg-2 font-medium'
                      : 'text-muted hover:text-fg hover:bg-bg-2',
                  ].join(' ')}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                className="ml-2 flex items-center bg-transparent border border-border cursor-pointer px-2 py-[6px] rounded-md text-muted text-sm transition-colors duration-150 hover:text-fg hover:border-border-2 min-w-[24px] min-h-[24px]"
              >
                {theme === 'dark' ? '○' : '●'}
              </button>
            </li>
          </ul>

          {/* Mobile: theme toggle + hamburger */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="flex items-center bg-transparent border border-border cursor-pointer px-2 py-1.5 rounded-md text-muted text-sm transition-colors duration-150"
            >
              {theme === 'dark' ? '○' : '●'}
            </button>
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              aria-expanded={sidebarOpen}
              className="flex flex-col justify-center items-center gap-1.25 w-9 h-9 bg-transparent border border-border rounded-md cursor-pointer"
            >
              <span className="block w-4 h-px bg-fg" />
              <span className="block w-4 h-px bg-fg" />
              <span className="block w-2.5 h-px bg-fg self-start ml-2.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
        className={[
          'fixed inset-0 bg-black/40 z-200 sm:hidden transition-opacity duration-300',
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      />

      {/* Sidebar drawer */}
      <aside
        aria-label="Mobile navigation"
        aria-hidden={!sidebarOpen}
        className={[
          'fixed top-0 right-0 h-full w-60 bg-bg border-l border-border z-201 sm:hidden',
          'flex flex-col pt-15 pb-8',
          'transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
          className="absolute top-3.5 right-4 w-8 h-8 flex items-center justify-center bg-transparent border border-border rounded-md text-muted cursor-pointer text-lg leading-none"
        >
          ×
        </button>

        <ul className="list-none px-3 pt-4 flex flex-col gap-0.5">
          {navItems.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={[
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-[0.9rem] no-underline transition-colors duration-150',
                  isActive(item.href)
                    ? 'text-fg bg-bg-2 font-medium'
                    : 'text-muted hover:text-fg hover:bg-bg-2',
                ].join(' ')}
              >
                <span className="text-[1rem] w-5 text-center">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
