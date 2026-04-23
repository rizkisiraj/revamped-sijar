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

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const t = stored ?? (prefersDark ? 'dark' : 'light');
    setTheme(t);
    document.documentElement.setAttribute('data-theme', t);
  }, []);

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
      {/* Desktop top nav */}
      <nav
        id="topNav"
        aria-label="Main navigation"
        className="fixed inset-x-0 top-0 h-[60px] bg-nav backdrop-blur-[12px] border-b border-border z-[100]"
      >
        <div className="max-w-[720px] mx-auto h-full flex items-center justify-between px-6">
          <Link
            href="/"
            className="font-mono text-[0.85rem] text-fg no-underline tracking-[-0.01em]"
          >
            sijar
          </Link>

          <ul className="flex items-center gap-1 list-none">
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
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav
        id="bottomNav"
        aria-label="Mobile navigation"
        className="hidden fixed inset-x-0 bottom-0 h-16 pb-safe bg-nav-mobile backdrop-blur-[16px] border-t border-border z-[100]"
      >
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href) ? 'page' : undefined}
            className={[
              'flex flex-col items-center justify-center flex-1 gap-[3px] no-underline transition-colors duration-150',
              isActive(item.href) ? 'text-fg opacity-100' : 'text-muted opacity-60',
            ].join(' ')}
          >
            <span className="text-[1.1rem] leading-none">{item.icon}</span>
            <span className="font-mono text-[0.6rem] tracking-[0.04em]">{item.label}</span>
          </Link>
        ))}
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="flex flex-col items-center justify-center flex-1 gap-[3px] bg-transparent border-none cursor-pointer text-muted opacity-60"
        >
          <span className="text-[1.1rem] leading-none">{theme === 'dark' ? '○' : '●'}</span>
          <span className="font-mono text-[0.6rem] tracking-[0.04em]">Theme</span>
        </button>
      </nav>
    </>
  );
}
