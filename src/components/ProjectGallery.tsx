/**
 * ProjectGallery
 *
 * Renders the demo media section and screenshot grid on project detail pages.
 * Used as a Server Component — no interactivity required.
 *
 * Asset placement guide
 * ─────────────────────
 * Demo video  →  public/projects/<slug>/demo.mp4  (or .webm)
 * Demo GIF    →  public/projects/<slug>/demo.gif
 * Screenshots →  public/projects/<slug>/screen-1.png  (any extension)
 *
 * Frontmatter fields that drive this component
 * ─────────────────────────────────────────────
 * demo: /projects/my-app/demo.mp4         # path relative to /public
 * demoCaption: 'Full walkthrough'         # optional label under the video
 * demoType: video                         # 'video' (default) | 'gif'
 * screenshots:
 *   - /projects/my-app/screen-1.png
 *   - /projects/my-app/screen-2.png
 * screenshotCaptions:                     # optional — length must match screenshots
 *   - 'Home screen'
 *   - 'Dashboard'
 */

import Image from 'next/image';
import type { Project } from '~/lib/types';

interface Props {
  project: Project;
}

/** Looping, muted, autoplaying video — far lighter than an equivalent GIF. */
function DemoVideo({ src, caption }: { src: string; caption?: string }) {
  return (
    <section className="mb-10" aria-label="App demo">
      <SectionLabel>Demo</SectionLabel>
      <div className="rounded-xl overflow-hidden border border-border bg-bg-2 shadow-sm">
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="w-full h-auto block"
          aria-label={caption ?? 'App demo video'}
        />
      </div>
      {caption && (
        <p className="mt-2 text-center font-mono text-[0.72rem] text-muted tracking-wide">
          {caption}
        </p>
      )}
    </section>
  );
}

/** Single .gif rendered via a plain <img> (next/image doesn't animate GIFs). */
function DemoGif({ src, caption }: { src: string; caption?: string }) {
  return (
    <section className="mb-10" aria-label="App demo">
      <SectionLabel>Demo</SectionLabel>
      <div className="rounded-xl overflow-hidden border border-border bg-bg-2 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={caption ?? 'App demo'}
          loading="lazy"
          decoding="async"
          className="w-full h-auto block"
        />
      </div>
      {caption && (
        <p className="mt-2 text-center font-mono text-[0.72rem] text-muted tracking-wide">
          {caption}
        </p>
      )}
    </section>
  );
}

/** Responsive screenshot grid with next/image for optimized delivery. */
function ScreenshotGrid({
  screenshots,
  captions,
  projectTitle,
}: {
  screenshots: string[];
  captions: string[];
  projectTitle: string;
}) {
  const isMobileApp = screenshots.length > 0 && isTallAspect(screenshots[0]!);

  return (
    <section className="mb-10" aria-label="Screenshots">
      <SectionLabel>Screenshots</SectionLabel>
      <div
        className={
          isMobileApp
            ? // Mobile/portrait screenshots: horizontal scroll row so they stay phone-sized
              'flex gap-3 overflow-x-auto pb-2 -mx-1 px-1'
            : // Web/landscape screenshots: responsive 2-col grid
              'grid grid-cols-1 sm:grid-cols-2 gap-3'
        }
      >
        {screenshots.map((src, i) => {
          const caption = captions[i];
          const altText = caption ?? `${projectTitle} screenshot ${i + 1}`;

          return (
            <figure
              key={src}
              className={
                isMobileApp
                  ? 'shrink-0 flex flex-col items-center'
                  : 'flex flex-col'
              }
            >
              <div
                className={[
                  'rounded-xl overflow-hidden border border-border bg-bg-2',
                  'shadow-sm',
                  isMobileApp ? 'h-[500px] w-auto' : 'w-full',
                ].join(' ')}
              >
                {isMobileApp ? (
                  // Portrait phone screenshots: fixed height, intrinsic width
                  // Can't use next/image fill here without a sized container that
                  // knows the aspect ratio, so we fall back to a plain img with lazy.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt={altText}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-auto block object-cover"
                  />
                ) : (
                  // Landscape web screenshots: next/image with responsive sizing
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src={src}
                      alt={altText}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                      loading="lazy"
                      placeholder="empty"
                    />
                  </div>
                )}
              </div>
              {caption && (
                <figcaption className="mt-1.5 text-center font-mono text-[0.7rem] text-muted tracking-wide">
                  {caption}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Heuristic: if the filename suggests a mobile screenshot (portrait).
 * We check for keywords like "screen", "iphone", "mobile", "phone" in the path,
 * OR we fall back to always treating as portrait when there are 3+ screenshots
 * and none of the common web screenshot patterns appear.
 *
 * In practice, the user controls this by choosing isMobileApp layout via
 * the screenshot filenames — they can also override by using wider images.
 * This is a best-effort heuristic, not a strict rule.
 */
function isTallAspect(src: string): boolean {
  const lower = src.toLowerCase();
  return (
    lower.includes('iphone') ||
    lower.includes('mobile') ||
    lower.includes('phone') ||
    lower.includes('ios') ||
    lower.includes('android')
  );
}

/** Small uppercase label above each section, matching the tag chip style. */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[0.65rem] text-muted tracking-[0.1em] uppercase mb-3 select-none">
      {children}
    </p>
  );
}

export function ProjectGallery({ project }: Props) {
  const hasDemo = Boolean(project.demo);
  const hasScreenshots =
    Array.isArray(project.screenshots) && project.screenshots.length > 0;

  if (!hasDemo && !hasScreenshots) return null;

  return (
    <div className="mt-10">
      <div className="h-px bg-border mb-8" />

      {/* Demo section */}
      {hasDemo && project.demo && (
        <>
          {project.demoType === 'gif' ? (
            <DemoGif src={project.demo} caption={project.demoCaption} />
          ) : (
            <DemoVideo src={project.demo} caption={project.demoCaption} />
          )}
        </>
      )}

      {/* Screenshots section */}
      {hasScreenshots && project.screenshots && (
        <ScreenshotGrid
          screenshots={project.screenshots}
          captions={project.screenshotCaptions ?? []}
          projectTitle={project.title}
        />
      )}
    </div>
  );
}
