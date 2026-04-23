'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { api } from '~/trpc/client';

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7)  return `${d}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* ── Discord SVG icon ── */
function DiscordIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}

export default function GuestbookPage() {
  const { data: session, status } = useSession();
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState('');

  const { data: entries = [], refetch } = api.guestbook.getAll.useQuery();
  const postMessage = api.guestbook.postMessage.useMutation({
    onSuccess: () => {
      setText('');
      setError(null);
      setStatusMsg('Message posted');
      void refetch();
    },
  });

  useEffect(() => {
    if (!statusMsg) return;
    const t = setTimeout(() => setStatusMsg(''), 3000);
    return () => clearTimeout(t);
  }, [statusMsg]);

  function handlePost() {
    if (!text.trim()) {
      setError('Message cannot be empty');
      return;
    }
    setError(null);
    postMessage.mutate({ message: text.trim() });
  }

  const userName = session?.user?.name ?? '';

  return (
    <div className="flex flex-col gap-8 max-w-[660px] animate-fade-up">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-4 font-mono text-[0.75rem] text-muted uppercase tracking-[0.08em]">
          <span className="inline-block w-4 h-px bg-muted shrink-0" />
          Guestbook
        </div>
        <h1 className="text-[1.75rem] font-semibold tracking-[-0.03em] leading-[1.2]">
          Leave a message
        </h1>
        <p className="text-[0.95rem] text-fg-2 leading-[1.8] mt-2">
          Say hi, share feedback, or just drop a note. I read every message.
        </p>
      </div>

      {/* Compose area — gated by auth */}
      <div className="animate-fade-up-2">
        {status === 'loading' ? (
          /* Skeleton while session loads */
          <div className="rounded-[8px] border border-border bg-card p-4 h-[120px] animate-pulse" />
        ) : session ? (
          /* ── Authenticated: compose box ── */
          <>
          <div className="rounded-[8px] border border-border bg-card transition-colors duration-150 focus-within:border-border-2 p-4">
            {/* Name row (read-only — pulled from session) */}
            <div
              aria-label={`Posting as ${userName}`}
              className="flex items-center gap-[10px] mb-[10px]"
            >
              <div className="flex items-center justify-center size-7 rounded-full bg-bg-2 border border-border font-mono text-[0.65rem] text-muted shrink-0 select-none overflow-hidden">
                {session.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={session.user.image} alt={userName} className="size-full object-cover" />
                ) : (
                  initials(userName)
                )}
              </div>
              <span className="text-[0.82rem] font-medium text-fg">{userName}</span>
            </div>

            {/* Textarea */}
            {error && (
              <p id="msg-error" role="alert" className="text-[0.78rem] text-red-500 mb-2">{error}</p>
            )}
            <textarea
              placeholder="Write something..."
              value={text}
              onChange={e => { setText(e.target.value.slice(0, 280)); if (error) setError(null); }}
              rows={3}
              aria-label="Your message"
              aria-invalid={!!error}
              aria-describedby={error ? 'msg-error' : undefined}
              autoComplete="off"
              className="no-outline w-full bg-transparent resize-none text-[0.9rem] text-fg leading-[1.6] placeholder:text-muted outline-none"
            />

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border mt-[10px] pt-[10px]">
              <span
                aria-live={text.length >= 240 ? 'polite' : 'off'}
                aria-atomic="true"
                className="font-mono text-[0.72rem] text-muted"
              >
                {text.length}/280
              </span>
              <button
                onClick={handlePost}
                disabled={!text.trim() || postMessage.isPending}
                className="px-3 py-1.5 rounded-md text-[0.82rem] font-medium bg-fg text-bg transition-opacity duration-150 disabled:opacity-40 active:opacity-85"
              >
                Post
              </button>
            </div>
          </div>
          <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">{statusMsg}</div>
          </>
        ) : (
          /* ── Unauthenticated: sign-in prompt ── */
          <div className="rounded-[8px] border border-border bg-card p-5 flex flex-col items-center gap-4 text-center">
            <div className="flex flex-col gap-1">
              <p className="text-[0.92rem] font-medium text-fg">Sign in to leave a message</p>
              <p className="text-[0.82rem] text-muted">Your name and avatar are pulled from your Discord account.</p>
            </div>
            <button
              onClick={() => signIn('discord')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-[0.85rem] font-medium bg-fg text-bg transition-opacity duration-150 hover:opacity-90 active:opacity-80"
            >
              <DiscordIcon />
              Sign in via Discord
            </button>
          </div>
        )}
      </div>

      {/* Thread */}
      <ul aria-live="polite" className="list-none animate-fade-up-3">
        {entries.map((entry, i) => {
          const name = entry.user.name ?? 'Anonymous';
          return (
            <li
              key={entry.id}
              className={[
                'py-4 border-b border-border',
                i === 0 ? 'border-t border-border' : '',
              ].join(' ')}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center justify-center size-[26px] rounded-full bg-bg-2 font-mono text-[0.65rem] text-muted shrink-0 select-none overflow-hidden">
                  {entry.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={entry.user.image} alt={name} className="size-full object-cover" />
                  ) : (
                    initials(name)
                  )}
                </div>
                <span className="text-[0.85rem] font-medium text-fg">{name}</span>
                <span className="font-mono text-[0.7rem] text-muted">{timeAgo(new Date(entry.createdAt))}</span>
              </div>
              <p className="pl-9 text-[0.88rem] text-fg-2 leading-[1.65]">{entry.message}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
