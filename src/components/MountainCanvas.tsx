'use client';
import { useEffect, useRef, useState } from 'react';

const POINTS: [number, number][] = [
  [0.00, 0.82], [0.06, 0.80], [0.13, 0.52], [0.18, 0.78], [0.27, 0.22],
  [0.34, 0.66], [0.41, 0.38], [0.47, 0.72], [0.55, 0.28], [0.62, 0.58],
  [0.70, 0.42], [0.76, 0.70], [0.84, 0.48], [0.91, 0.75], [1.00, 0.80],
];

function catmullRom(
  p0: [number, number], p1: [number, number],
  p2: [number, number], p3: [number, number],
  t: number
): [number, number] {
  const t2 = t * t, t3 = t2 * t;
  return [
    0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
    0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
  ];
}

function buildCurve(pts: [number, number][], steps = 12): [number, number][] {
  const result: [number, number][] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]!;
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p3 = pts[Math.min(pts.length - 1, i + 2)]!;
    for (let s = 0; s <= steps; s++) {
      result.push(catmullRom(p0, p1, p2, p3, s / steps));
    }
  }
  return result;
}

function arcLengths(pts: [number, number][]): number[] {
  const lens = [0];
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i]![0] - pts[i - 1]![0];
    const dy = pts[i]![1] - pts[i - 1]![1];
    lens.push(lens[i - 1]! + Math.sqrt(dx * dx + dy * dy));
  }
  return lens;
}

function getThemeColor() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--color-fg')
    .trim() || '#09090b';
}

export default function MountainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const [hovering, setHovering] = useState(false);
  const [color, setColor] = useState('#09090b');

  // Sync color on mount and whenever data-theme attribute changes
  useEffect(() => {
    setColor(getThemeColor());
    const observer = new MutationObserver(() => setColor(getThemeColor()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.offsetWidth || 720;
    const h = canvas.offsetHeight || 180;
    canvas.width = w;
    canvas.height = h;

    const worldPts: [number, number][] = POINTS.map(([x, y]) => [x * w, y * h]);
    const curve = buildCurve(worldPts);
    const lens = arcLengths(curve);
    const totalLen = lens[lens.length - 1]!;

    function drawFull() {
      ctx!.clearRect(0, 0, w, h);
      ctx!.beginPath();
      ctx!.strokeStyle = color;
      ctx!.lineWidth = 1.5;
      ctx!.lineCap = 'round';
      ctx!.lineJoin = 'round';
      curve.forEach(([x, y], i) => (i === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y)));
      ctx!.stroke();
    }

    function drawAnimated(progress: number) {
      ctx!.clearRect(0, 0, w, h);
      const targetLen = totalLen * progress;

      // Ghost line
      ctx!.beginPath();
      ctx!.globalAlpha = 0.15;
      ctx!.strokeStyle = color;
      ctx!.lineWidth = 1.5;
      curve.forEach(([x, y], i) => (i === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y)));
      ctx!.stroke();
      ctx!.globalAlpha = 1;

      // Drawn portion
      ctx!.beginPath();
      ctx!.strokeStyle = color;
      ctx!.lineWidth = 1.5;
      ctx!.lineCap = 'round';
      ctx!.lineJoin = 'round';
      let started = false;
      let dot: [number, number] = curve[0]!;
      for (let i = 0; i < curve.length; i++) {
        if (lens[i]! <= targetLen) {
          if (!started) { ctx!.moveTo(curve[i]![0], curve[i]![1]); started = true; }
          else ctx!.lineTo(curve[i]![0], curve[i]![1]);
          dot = curve[i]!;
        }
      }
      ctx!.stroke();

      // Leading dot
      ctx!.beginPath();
      ctx!.arc(dot[0], dot[1], 3, 0, Math.PI * 2);
      ctx!.fillStyle = color;
      ctx!.shadowColor = color;
      ctx!.shadowBlur = 8;
      ctx!.fill();
      ctx!.shadowBlur = 0;
    }

    if (!hovering) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      drawFull();
    } else {
      const duration = 2000;
      let start: number | null = null;
      const animate = (ts: number) => {
        if (!start) start = ts;
        const progress = ((ts - start) % duration) / duration;
        drawAnimated(progress);
        animRef.current = requestAnimationFrame(animate);
      };
      animRef.current = requestAnimationFrame(animate);
    }

    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [hovering, color]);

  return (
    <div
      onMouseEnter={() => {
        if (window.matchMedia('(hover: none)').matches) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        setHovering(true);
      }}
      onMouseLeave={() => setHovering(false)}
      className="-mx-6 border-y border-border"
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Mountain landscape line animation"
        className="block w-full h-[180px]"
      />
    </div>
  );
}
