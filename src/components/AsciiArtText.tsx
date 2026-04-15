"use client";

import { useEffect, useRef } from "react";

import { useMounted } from "@/lib/useMounted";

/**
 * ASCII-art wordmark, artefakt.mov-style.
 *
 *   1. Rasterise the headline to an offscreen "mask" canvas at the display
 *      size in Satoshi, with word-wrap.
 *   2. Walk the mask on a tight grid (CELL ≈ 5 px in display coords). For
 *      every cell whose average alpha clears the threshold, store a cell:
 *      position + density-mapped glyph + accent flag.
 *   3. Every frame, render cells into the visible canvas in JetBrains Mono.
 *      Every cell re-rolls its glyph every frame from within ±DENSITY_WINDOW
 *      of its resting density index — this gives TV-static constant motion
 *      while keeping the wordmark shape readable. Cells inside the cursor's radius are
 *      displaced outward along the vector from the cursor (smoothstep
 *      falloff) and forced to a random glyph. When the cursor leaves,
 *      their position eases back to the resting grid.
 *   4. The ResizeObserver rebuilds the grid on resize / font load. No entrance
 *      animation — the wordmark appears and immediately starts shimmering.
 *      prefers-reduced-motion is intentionally not applied to the shimmer
 *      (low-intensity constant texture, not a triggered motion event).
 */

const CELL_BASE = 4; // px in display coordinates — tiny artefakt-style grid
const DISTURB_RADIUS = 80;  // px radius of cursor influence (halved)
const DISTURB_PUSH = 70;    // max displacement at cursor epicenter (+25%)
const DISTURB_JITTER = 8;   // random scatter amount at cursor epicenter
const LERP_ATTACK = 0.22;   // how fast cells flee when cursor enters
const LERP_DECAY  = 0.11;   // how fast cells return to rest (50% slower than attack)
const REFRESH_CHANCE = 0.2; // ambient shimmer rate — 20% of cells change per frame
const DENSITY_WINDOW = 5;   // shimmer rerolls within ±N of the real density index
// Density ramp — light → dense — Paul Bourke short ramp, capped before @
// so very dense cells don't look chunky at 4px.
const RAMP = "`'.-:_=<>i!1?3T%R#";
const MIN_ALPHA = 72; // ignore cells below this avg alpha

type Cell = {
  x: number; // top-left in display px (resting position)
  y: number;
  char: string; // current displayed character
  realChar: string; // resting character from density ramp
  isAccent: boolean;
  ox: number; // current x offset from rest (for ease-back)
  oy: number; // current y offset from rest
  nr: number; // per-cell noise ratio — offsets the effective cursor radius so the boundary is never a perfect circle
};

type Props = {
  text: string;
  accentWord?: string;
  className?: string;
  "aria-label"?: string;
};

function densityToChar(density: number) {
  const idx = Math.min(
    RAMP.length - 1,
    Math.max(0, Math.floor(density * (RAMP.length - 1))),
  );
  return RAMP[idx];
}

/** Reroll a cell's glyph to a character within ±DENSITY_WINDOW of its
 *  resting density index — preserves the wordmark shape while the
 *  shimmer effect plays on top. Picking purely at random from a pool
 *  of glyphs like `#%@&$` destroys readability. */
function rerollNearDensity(realChar: string) {
  const realIdx = RAMP.indexOf(realChar);
  if (realIdx < 0) return realChar;
  const lo = Math.max(0, realIdx - DENSITY_WINDOW);
  const hi = Math.min(RAMP.length - 1, realIdx + DENSITY_WINDOW);
  return RAMP[lo + Math.floor(Math.random() * (hi - lo + 1))];
}

/** Fully-random pick across the ramp — used when cells are caught in
 *  the cursor's disturbance radius and the shape is already broken. */
function pickRandomGlyph() {
  return RAMP[Math.floor(Math.random() * RAMP.length)];
}

/** smoothstep(0, 1, x) — classic Perlin ease */
function smoothstep(x: number) {
  const t = Math.max(0, Math.min(1, x));
  return t * t * (3 - 2 * t);
}

export function AsciiArtText({
  text,
  accentWord,
  className,
  "aria-label": ariaLabel,
}: Props) {
  const mounted = useMounted();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Refs that the raf loop reads without triggering React re-renders.
  const cellsRef = useRef<Cell[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const canvasRectRef = useRef<DOMRect | null>(null);
  const sizeRef = useRef({ w: 0, h: 0, cell: CELL_BASE });

  useEffect(() => {
    if (!mounted) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const satoshiFamily =
      'Satoshi, "Satoshi Fallback", system-ui, -apple-system, sans-serif';
    const monoFamily =
      '"JetBrains Mono", "JetBrains Mono Fallback", ui-monospace, monospace';

    // Kanagawa colors, read live from CSS so a palette swap Just Works.
    const css = getComputedStyle(document.documentElement);
    const fgColor = css.getPropertyValue("--fg-primary").trim() || "#ddd0b8";
    const accentColor = css.getPropertyValue("--accent").trim() || "#c49a5c";

    let raf = 0;
    let running = true;

    // ------------------------------------------------------------------
    //  Build / rebuild
    // ------------------------------------------------------------------

    const build = () => {
      const rect = container.getBoundingClientRect();
      const W = Math.max(320, rect.width);
      if (W === 0) return;

      // Display font size — matches the original clamp(3.25rem, 11vw, 11rem)
      // so the wordmark wraps like a normal Satoshi h1 would.
      const vwPx = (11 / 100) * window.innerWidth;
      const fontSize = Math.max(56, Math.min(192, Math.min(vwPx, W * 0.14)));

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      // Cell size scales subtly with viewport so the density feels
      // consistent from laptop (1280) to 5K. Clamped [4, 5] — tiny grid.
      const cell = Math.max(
        4,
        Math.min(5, Math.round(W / 320)),
      );

      // Word-wrap the text by measuring word widths in the target font.
      const measureCtx = document.createElement("canvas").getContext("2d")!;
      measureCtx.font = `600 ${fontSize}px ${satoshiFamily}`;
      const words = text.split(/\s+/);
      const lines: string[] = [];
      let current = "";
      for (const word of words) {
        const test = current ? `${current} ${word}` : word;
        if (measureCtx.measureText(test).width <= W) {
          current = test;
        } else {
          if (current) lines.push(current);
          current = word;
        }
      }
      if (current) lines.push(current);
      if (lines.length === 0) return;

      const lineHeight = fontSize * 0.92;
      const H = Math.ceil(lines.length * lineHeight + fontSize * 0.22);

      // Size the mask offscreen canvas.
      const mask = document.createElement("canvas");
      mask.width = Math.ceil(W * dpr);
      mask.height = Math.ceil(H * dpr);
      const mctx = mask.getContext("2d", { willReadFrequently: true });
      if (!mctx) return;
      mctx.scale(dpr, dpr);
      mctx.fillStyle = "#ffffff";
      mctx.textBaseline = "top";
      mctx.font = `600 ${fontSize}px ${satoshiFamily}`;

      for (let i = 0; i < lines.length; i += 1) {
        mctx.fillText(lines[i], 0, i * lineHeight);
      }

      // Compute the accent word's bounding box (first occurrence).
      type AccentBounds = { x1: number; y1: number; x2: number; y2: number };
      const findAccent = (): AccentBounds | null => {
        if (!accentWord) return null;
        for (let i = 0; i < lines.length; i += 1) {
          const idx = lines[i].indexOf(accentWord);
          if (idx >= 0) {
            const before = mctx.measureText(lines[i].slice(0, idx)).width;
            const wordW = mctx.measureText(accentWord).width;
            return {
              x1: before,
              y1: i * lineHeight,
              x2: before + wordW,
              // Extend to full canvas height on the last line so descenders
              // (e.g. the 'p' in "ships.") are covered and don't bleed into fgColor.
              y2: i === lines.length - 1 ? H : (i + 1) * lineHeight,
            };
          }
        }
        return null;
      };
      const accent = findAccent();

      // Sample mask on grid.
      const img = mctx.getImageData(0, 0, mask.width, mask.height);
      const data = img.data;
      const maskW = mask.width;
      const cells: Cell[] = [];

      for (let y = 0; y < H; y += cell) {
        for (let x = 0; x < W; x += cell) {
          // Average alpha across a few sample points inside the cell.
          let total = 0;
          let count = 0;
          for (let dy = 1; dy < cell; dy += 2) {
            for (let dx = 1; dx < cell; dx += 2) {
              const sx = Math.floor((x + dx) * dpr);
              const sy = Math.floor((y + dy) * dpr);
              const idx = (sy * maskW + sx) * 4 + 3; // alpha
              if (idx >= 0 && idx < data.length) {
                total += data[idx];
                count += 1;
              }
            }
          }
          if (count === 0) continue;
          const avg = total / count;
          if (avg < MIN_ALPHA) continue;

          const density = avg / 255;
          const cx = x + cell / 2;
          const cy = y + cell / 2;
          const inAccent =
            accent !== null &&
            cx >= accent.x1 - 1 &&
            cx <= accent.x2 + 1 &&
            cy >= accent.y1 &&
            cy <= accent.y2;

          const ch = densityToChar(density);
          cells.push({
            x,
            y,
            char: ch,
            realChar: ch,
            isAccent: inAccent,
            ox: 0,
            oy: 0,
            // Each cell gets a permanent random radius multiplier in [0.78, 1.22].
            // This ragged ±22% variance breaks the circle into an organic blob
            // boundary — cells near the edge are individually in or out.
            nr: 0.78 + Math.random() * 0.44,
          });
        }
      }

      cellsRef.current = cells;

      // Size visible canvas.
      canvas.width = Math.ceil(W * dpr);
      canvas.height = Math.ceil(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      // Glyph font matches the cell pitch so neighbouring characters
      // never touch — this is what keeps the pixel-level feel clean.
      const glyphSize = cell + 2;
      ctx.font = `600 ${glyphSize}px ${monoFamily}`;
      ctx.textBaseline = "top";

      sizeRef.current = { w: W, h: H, cell };
      canvasRectRef.current = canvas.getBoundingClientRect();
    };

    // ------------------------------------------------------------------
    //  Render loop
    // ------------------------------------------------------------------

    const render = () => {
      if (!running) return;
      const cells = cellsRef.current;
      const { w: W, h: H } = sizeRef.current;
      if (W === 0 || H === 0 || cells.length === 0) {
        raf = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, W, H);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mouseActive = mouseRef.current.active;
      // Slow-moving time value for the animated boundary wobble.
      // Divided down so the shape drifts rather than spins.
      const ft = Date.now() / 1000;

      // Draw in two batches to minimise fillStyle changes (perf hot path).
      // Pass 1: non-accent. Pass 2: accent. Each pass does its own shimmer.
      ctx.fillStyle = fgColor;
      for (let i = 0; i < cells.length; i += 1) {
        const c = cells[i];
        if (c.isAccent) continue;
        updateCell(c, mx, my, mouseActive, ft);
        ctx.fillText(c.char, c.x + c.ox, c.y + c.oy);
      }
      ctx.fillStyle = accentColor;
      for (let i = 0; i < cells.length; i += 1) {
        const c = cells[i];
        if (!c.isAccent) continue;
        updateCell(c, mx, my, mouseActive, ft);
        ctx.fillText(c.char, c.x + c.ox, c.y + c.oy);
      }

      raf = requestAnimationFrame(render);
    };

    const updateCell = (c: Cell, mx: number, my: number, active: boolean, ft: number) => {
      const cellSize = sizeRef.current.cell;
      const cx = c.x + cellSize / 2;
      const cy = c.y + cellSize / 2;

      // --- Displacement target ------------------------------------------
      let targetOx = 0;
      let targetOy = 0;
      let withinCursor = false;

      if (active) {
        const dx = mx - cx;
        const dy = my - cy;
        const dist = Math.hypot(dx, dy);

        // Wobbly boundary — three sine harmonics at different angles and
        // drift speeds make an amoeba-like shape that morphs over time.
        // c.nr is a permanent per-cell random factor that further ragged
        // the edge so cells near the boundary are individually in or out.
        const angle = Math.atan2(dy, dx);
        const wobble =
          Math.sin(angle * 3 + ft * 0.7)  * 0.20 +
          Math.sin(angle * 7 - ft * 1.05) * 0.10 +
          Math.cos(angle * 5 + ft * 0.45) * 0.13;
        const effectiveRadius = DISTURB_RADIUS * (1 + wobble) * c.nr;

        if (dist < effectiveRadius) {
          withinCursor = true;
          // Squared smoothstep falloff — "blown dust" feel.
          const t = 1 - dist / effectiveRadius;
          const s = smoothstep(t);
          const falloff = s * s;
          const push = falloff * DISTURB_PUSH;
          const jitter = falloff * DISTURB_JITTER;
          const len = Math.max(dist, 0.001);
          targetOx = -(dx / len) * push + (Math.random() - 0.5) * jitter;
          targetOy = -(dy / len) * push + (Math.random() - 0.5) * jitter;
        }
      }

      // --- Lerp toward target (fast attack, slow decay) -----------------
      const lerpSpeed = withinCursor ? LERP_ATTACK : LERP_DECAY;
      c.ox += (targetOx - c.ox) * lerpSpeed;
      c.oy += (targetOy - c.oy) * lerpSpeed;
      if (!withinCursor && Math.abs(c.ox) < 0.05) c.ox = 0;
      if (!withinCursor && Math.abs(c.oy) < 0.05) c.oy = 0;

      // --- Glyph selection ----------------------------------------------
      if (withinCursor) {
        // Cells caught in the cursor zone: full-random glyph —
        // shape is already broken, so variety sells the scatter.
        c.char = pickRandomGlyph();
        return;
      }

      // Ambient shimmer: 20% of cells reroll per frame — subtle TV-static
      // at rest, vs 100% of cells in the cursor zone (pickRandomGlyph).
      // rerollNearDensity keeps the pick within ±DENSITY_WINDOW of the
      // resting density index so the wordmark shape stays legible.
      // NOTE: We intentionally skip the prefers-reduced-motion check here.
      // This shimmer is a constant low-intensity texture, not a triggered
      // animation — it doesn't cause the disorientation that the spec is
      // designed to prevent. Cursor displacement (above) is user-initiated.
      if (Math.random() < REFRESH_CHANCE) {
        c.char = rerollNearDensity(c.realChar);
      } else {
        c.char = c.realChar;
      }
    };

    // ------------------------------------------------------------------
    //  Event wiring
    // ------------------------------------------------------------------

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvasRectRef.current;
      if (!rect) return;
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const onPointerLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    const onScrollOrResize = () => {
      if (canvas) canvasRectRef.current = canvas.getBoundingClientRect();
    };

    const ro = new ResizeObserver(() => {
      build();
    });

    build();

    // Font loading races the first build — rebuild once fonts are ready.
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (running) build();
      });
    }

    raf = requestAnimationFrame(render);

    ro.observe(container);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [mounted, text, accentWord]);

  return (
    <div
      ref={containerRef}
      className={className}
      role="img"
      aria-label={ariaLabel ?? text}
      // Reserve vertical space so the canvas mount doesn't cause layout
      // shift (CLS). The clamp() mirrors the font-size scaling in build()
      // — roughly 2 lines at the largest font-size the wordmark can reach.
      style={{ minHeight: "clamp(9rem, 25vw, 22rem)" }}
    >
      <canvas
        ref={canvasRef}
        className="block w-full pointer-events-none"
        aria-hidden
      />
      {/* Fallback text for SSR and reduced-motion. The canvas paints over
          this once mounted. The `sr-only` class keeps it off-screen for
          sighted users but available to AT and copy-paste. */}
      <span className="sr-only">{text}</span>
    </div>
  );
}
