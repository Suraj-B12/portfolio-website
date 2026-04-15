"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * Thin vertical progress line anchored to the right edge of the viewport.
 * Scales vertically based on scroll progress. Purely decorative — the
 * actual scrollbar is hidden in globals.css.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-[18px] top-[var(--nav-height)] bottom-8 z-[65] w-px"
    >
      {/* Track */}
      <div className="absolute inset-0 bg-fg-faint" />
      {/* Fill — scales from top */}
      <motion.div
        className="absolute inset-x-0 top-0 origin-top bg-accent"
        style={{
          scaleY: smoothed,
          height: "100%",
        }}
      />
    </div>
  );
}
