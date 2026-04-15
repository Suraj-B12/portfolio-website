"use client";

import { motion } from "motion/react";

import { AsciiArtText } from "@/components/AsciiArtText";
import { MetaCell } from "@/components/MetaCell";
import { EASE } from "@/lib/motion";
import { useMounted } from "@/lib/useMounted";
import { site } from "@/data/site";

export function Hero() {
  const mounted = useMounted();

  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative min-h-[100svh] overflow-hidden bg-bg"
    >
      {/* Artefakt-style subtle dot grid — pure CSS, no blur, no blob. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ddd0b8 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="container-x relative flex min-h-[100svh] flex-col justify-between pt-[var(--nav-height)]">
        {/* Top rail */}
        <div className="mt-12 flex items-center justify-between">
          <div className="mono-label text-fg-muted">( Portfolio / 2026 )</div>
          <div className="mono-label hidden text-fg-muted sm:block">
            {site.location}
          </div>
        </div>

        {/* Headline */}
        <div className="flex flex-1 flex-col justify-center py-16">
          <div className="mb-8 flex items-center gap-4">
            {mounted ? (
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
                className="block h-px w-16 origin-left bg-accent"
              />
            ) : (
              <span className="block h-px w-16 bg-accent" />
            )}
            <span className="mono-label text-accent">{site.name}</span>
          </div>

          {/* ASCII art wordmark — each letter composed of tiny mono glyphs,
              cursor within the canvas distorts nearby glyphs. */}
          <AsciiArtText
            text={site.headline}
            accentWord={site.headlineAccent}
            className="w-full"
            aria-label={site.headline}
          />

          <p className="mt-8 max-w-xl text-fg-secondary text-lg md:text-xl leading-relaxed">
            {site.subheadline}
          </p>
        </div>

        {/* Bottom rail */}
        <div className="mb-10 grid grid-cols-2 gap-6 sm:grid-cols-4 border-t border-border-dark pt-8">
          <MetaCell label="Focus" value="Systems & AI" />
          <MetaCell label="Status" value="Open to mid-2026 roles" />
          <MetaCell label="Based" value="Bengaluru" />
          <MetaCell label="Scroll" value="↓ keep going" accent />
        </div>
      </div>
    </section>
  );
}
