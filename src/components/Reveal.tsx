"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { EASE } from "@/lib/motion";
import { useMounted } from "@/lib/useMounted";

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "article" | "span" | "h1" | "h2" | "p" | "li";
  once?: boolean;
};

/**
 * Scroll-triggered reveal. SSR-safe: renders static markup until mounted
 * on the client, then lets motion take over. This prevents hydration
 * mismatches caused by client-only `initial` styles.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
  once = true,
}: Props) {
  const mounted = useMounted();
  const reduce = useReducedMotion();

  // On server / before mount / with reduced motion: render a plain tag.
  // This keeps server HTML == client HTML for the first paint.
  if (!mounted || reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
