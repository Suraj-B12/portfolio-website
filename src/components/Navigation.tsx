"use client";

import { useEffect, useId, useRef, useState, useCallback } from "react";
import { motion } from "motion/react";

import { EASE } from "@/lib/motion";
import { useMounted } from "@/lib/useMounted";
import { nav, site } from "@/data/site";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------ */
/*  Displacement-map math                                              */
/* ------------------------------------------------------------------ */

/** Hermite interpolation — 0 when t ≤ a, 1 when t ≥ b. */
function smoothStep(a: number, b: number, t: number): number {
  const x = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function Navigation() {
  const mounted = useMounted();
  const [activeSection, setActiveSection] = useState<string>("");
  const [size, setSize] = useState({ w: 1, h: 1 });

  const headerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const feImageRef = useRef<SVGFEImageElement>(null);
  const feDispRef = useRef<SVGFEDisplacementMapElement>(null);
  // useId() is deterministic across SSR and client, so the filter's
  // url(#...) reference matches on both sides and React doesn't throw
  // a hydration mismatch. Math.random() used to re-roll per render and
  // produced the `+ id="glass-xyz" / - id="glass-abc"` diff.
  const reactId = useId();
  const filterId = `glass-${reactId.replace(/[^a-z0-9]/gi, "")}`;

  /* ── Active section tracking ────────────────────────────────────── */

  useEffect(() => {
    const sections = nav
      .map((item) => document.querySelector(item.href))
      .filter(Boolean) as Element[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const next = `#${entry.target.id}`;
          setActiveSection((prev) => (prev === next ? prev : next));
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  /* ── Header size tracking ───────────────────────────────────────── */

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 1 && height > 1) {
        setSize({ w: Math.floor(width), h: Math.floor(height) });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ── Displacement map generation ────────────────────────────────── */
  /*                                                                    */
  /* We build a displacement texture on an off-screen canvas and feed   */
  /* it into an SVG <feDisplacementMap>. The filter is chained into     */
  /* `backdrop-filter`, so the browser applies the warp to the BACKDROP */
  /* (pixels behind the header) before blurring & saturating.           */
  /*                                                                    */
  /* The refraction zone is the bottom ~25 % of the header. Inside that */
  /* zone, UVs are pulled slightly inward (toward the glass body),      */
  /* simulating the way a thick glass panel bends light at its edge.    */
  /* ------------------------------------------------------------------ */

  const updateShader = useCallback(() => {
    const canvas = canvasRef.current;
    const feImage = feImageRef.current;
    const feDisp = feDispRef.current;
    if (!canvas || !feImage || !feDisp || size.w <= 1 || size.h <= 1)
      return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = size.w;
    const h = size.h;
    canvas.width = w;
    canvas.height = h;

    const pixels = new Uint8ClampedArray(w * h * 4);
    let maxScale = 0;
    const raw: number[] = [];

    /* Pass 1 — compute raw displacement vectors. */
    for (let i = 0; i < w * h; i++) {
      const x = i % w;
      const y = Math.floor(i / w);
      const u = x / w; // 0 → 1 left to right
      const v = y / h; // 0 → 1 top to bottom

      /*
       * Edge proximity: 0 inside the glass body, ramping to 1 at the
       * very bottom pixel. The smoothStep transition starts at v = 0.72
       * (bottom ~28 % of the header).
       */
      const edge = smoothStep(0.72, 1.0, v);

      /*
       * Displacement direction: at the bottom boundary the background
       * pixels are pulled inward (upward + toward centre), creating a
       * subtle convex-lens refraction you subconsciously notice.
       *
       * dx: horizontal pull toward centre (u − 0.5)
       * dy: vertical pull upward (negative v direction)
       */
      const dx = (u - 0.5) * edge * 0.12;
      const dy = -(1 - v) * edge * 0.35;

      maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));
      raw.push(dx, dy);
    }

    maxScale = Math.max(maxScale, 0.001) * 0.5;

    /* Pass 2 — normalise into 0-255 range (128 = no displacement). */
    let di = 0;
    let ri = 0;
    for (let i = 0; i < w * h; i++) {
      const r = raw[ri++] / maxScale + 0.5;
      const g = raw[ri++] / maxScale + 0.5;
      pixels[di++] = r * 255; // R → X displacement
      pixels[di++] = g * 255; // G → Y displacement
      pixels[di++] = 0;
      pixels[di++] = 255;
    }

    ctx.putImageData(new ImageData(pixels, w, h), 0, 0);

    /* Feed into the SVG filter. */
    feImage.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "href",
      canvas.toDataURL(),
    );
    feDisp.setAttribute("scale", (maxScale).toString());
  }, [size]);

  useEffect(() => {
    updateShader();
  }, [updateShader]);

  /* ── Render ─────────────────────────────────────────────────────── */

  return (
    <>
      {/* Hidden SVG filter definition — referenced by backdrop-filter. */}
      <svg
        width="0"
        height="0"
        style={{ position: "fixed", pointerEvents: "none", zIndex: -1 }}
        aria-hidden
      >
        <defs>
          <filter
            id={filterId}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
            x="0"
            y="0"
            width={size.w}
            height={size.h}
          >
            <feImage
              ref={feImageRef}
              width={size.w}
              height={size.h}
              result="dispMap"
            />
            <feDisplacementMap
              ref={feDispRef}
              in="SourceGraphic"
              in2="dispMap"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Off-screen canvas for displacement map generation */}
      <canvas ref={canvasRef} style={{ display: "none" }} aria-hidden />

      {/* ── Glass header ──────────────────────────────────────────── */}
      <motion.header
        ref={headerRef}
        initial={mounted ? { y: -24, opacity: 0 } : false}
        animate={mounted ? { y: 0, opacity: 1 } : undefined}
        transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
        className="fixed inset-x-0 top-0 z-50 overflow-hidden"
        style={{
          /*
           * Safari doesn't support url() inside backdrop-filter, so
           * -webkit-backdrop-filter uses blur-only as a graceful fallback.
           * Chrome/Edge get the full SVG refraction + blur chain.
           */
          WebkitBackdropFilter:
            "blur(28px) saturate(160%) brightness(1.06)",
          backdropFilter:
            `url(#${filterId}) blur(28px) saturate(160%) brightness(1.06)`,
          boxShadow:
            "0 4px 24px rgba(0,0,0,0.18), inset 0 -6px 16px rgba(0,0,0,0.06)",
        }}
      >
        {/* L1 — Dark substrate: ensures text contrast over any bg. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(18,15,12,0.50) 0%, rgba(18,15,12,0.36) 100%)",
          }}
        />

        {/* L2 — Frosted surface: faint white catches top-face "light". */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.015) 50%, transparent 75%)",
          }}
        />

        {/* L3 — Top specular rim: the highlight that reads as glass. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0"
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.2) 75%, transparent 95%)",
          }}
        />

        {/* L4 — Bottom rim: the glass bottom edge, dimmer. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0"
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.05) 75%, transparent 95%)",
          }}
        />

        {/* ── Nav content ─────────────────────────────────────────── */}
        <nav
          aria-label="Primary"
          className="relative z-10 container-x flex h-[var(--nav-height)] items-center justify-between"
        >
          {/* Wordmark */}
          <a
            href="#top"
            className="group flex items-center gap-2 text-fg transition-colors hover:text-accent"
            aria-label="Home"
          >
            <span className="font-mono text-sm font-semibold tracking-tight">
              {site.initials}
            </span>
            <span className="mono-label text-fg-muted transition-colors group-hover:text-accent">
              / {site.shortName.toLowerCase()}.dev
            </span>
          </a>

          {/* Section links */}
          <ul className="hidden md:flex items-center gap-8">
            {nav.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    data-link
                    className={cn(
                      "mono-label relative py-1 transition-colors duration-200",
                      isActive ? "text-accent" : "text-fg-secondary",
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-0 -bottom-[3px] h-px bg-accent"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* CTA */}
          <a
            href={`mailto:${site.email}`}
            data-link
            className="mono-label text-fg-secondary"
          >
            Say hi →
          </a>
        </nav>
      </motion.header>
    </>
  );
}
