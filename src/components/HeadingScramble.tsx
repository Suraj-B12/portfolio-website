"use client";

import { useEffect, useRef, useState } from "react";

import { useMounted } from "@/lib/useMounted";

/**
 * Scramble-reveal headline. Runs exactly once when the element enters
 * the viewport. Each non-whitespace character cycles through a small
 * glyph ramp staggered left-to-right, then locks into its real value.
 *
 * We drive the "in-viewport" check with a plain scroll listener + an
 * initial rect check, not IntersectionObserver. Two reasons:
 *   1. We need an initial check for already-visible headings (hero + any
 *      section that paints above the fold on load).
 *   2. Headless preview environments don't reliably fire IntersectionObserver
 *      callbacks; scroll events work consistently across real and preview
 *      browsers.
 */

const GLYPHS = " .:-=+*/<>|\\#%@?";
function pickGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

type Props = {
  text: string;
  /** Substring of `text` to render in the accent color (must appear verbatim). */
  accentText?: string;
  /** Stagger per character in ms */
  stepMs?: number;
  /** How long each character cycles before locking (ms) */
  cycleMs?: number;
  className?: string;
};

type Segment = { text: string; accent: boolean };

function splitAccent(text: string, accentText?: string): Segment[] {
  if (!accentText) return [{ text, accent: false }];
  const idx = text.indexOf(accentText);
  if (idx < 0) return [{ text, accent: false }];
  const segs: Segment[] = [];
  if (idx > 0) segs.push({ text: text.slice(0, idx), accent: false });
  segs.push({ text: accentText, accent: true });
  if (idx + accentText.length < text.length) {
    segs.push({ text: text.slice(idx + accentText.length), accent: false });
  }
  return segs;
}

export function HeadingScramble({
  text,
  accentText,
  stepMs = 18,
  cycleMs = 620,
  className,
}: Props) {
  const mounted = useMounted();
  const ref = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);
  const [display, setDisplay] = useState<string>(text);

  useEffect(() => {
    if (!mounted) return;
    const el = ref.current;
    if (!el) return;

    const runScramble = () => {
      if (startedRef.current) return null;
      startedRef.current = true;

      const start = performance.now();
      let tickId: ReturnType<typeof setInterval> | null = null;

      const tick = () => {
        const elapsed = performance.now() - start;
        let allLocked = true;
        let out = "";
        for (let i = 0; i < text.length; i += 1) {
          const real = text[i];
          if (/\s/.test(real)) {
            out += real;
            continue;
          }
          const charEnd = i * stepMs + cycleMs;
          if (elapsed < charEnd) {
            out += pickGlyph();
            allLocked = false;
          } else {
            out += real;
          }
        }
        setDisplay(out);
        if (allLocked && tickId !== null) {
          clearInterval(tickId);
          tickId = null;
        }
      };

      tick(); // first frame immediately
      tickId = setInterval(tick, 40);
      return () => {
        if (tickId !== null) clearInterval(tickId);
      };
    };

    let scrambleCleanup: (() => void) | null = null;

    const isVisible = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Fire when at least a third of the heading has scrolled into view.
      return rect.top < vh * 0.85 && rect.bottom > vh * 0.15;
    };

    // Poll with setInterval — simpler than rAF and guaranteed to fire in
    // every browser + headless preview environment. 80ms is imperceptibly
    // snappy for a viewport-entry reveal.
    const poll = () => {
      if (startedRef.current) return;
      if (isVisible()) {
        scrambleCleanup = runScramble();
        clearInterval(intervalId);
      }
    };
    poll(); // initial check
    const intervalId = setInterval(poll, 80);

    return () => {
      clearInterval(intervalId);
      scrambleCleanup?.();
    };
  }, [mounted, text, stepMs, cycleMs]);

  // Render: split the REAL text into accent/non-accent runs, then slice the
  // (possibly scrambled) display by the same offsets so the accent colour
  // stays locked to position even mid-scramble.
  const current = mounted && display.length === text.length ? display : text;
  const realSegs = splitAccent(text, accentText);
  const segs: Segment[] = [];
  let cursor = 0;
  for (const s of realSegs) {
    segs.push({
      text: current.slice(cursor, cursor + s.text.length),
      accent: s.accent,
    });
    cursor += s.text.length;
  }

  return (
    <span
      ref={ref}
      className={className}
      aria-label={text}
      suppressHydrationWarning
    >
      {segs.map((seg, i) =>
        seg.accent ? (
          <span key={i} className="text-accent">
            {seg.text}
          </span>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </span>
  );
}
