"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

import { useMounted } from "@/lib/useMounted";

type HoverKind = "idle" | "link" | "cta";

/**
 * A minimal monospace cursor:
 *  - Small dot that follows the mouse with a slight spring lag
 *  - Expands into a ring with a label ("visit", "email", etc.) when
 *    hovering anchors / buttons that opt-in via data-cursor="..."
 *  - Hides itself on touch devices and when reduced-motion is set
 */
export function CustomCursor() {
  const mounted = useMounted();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState<HoverKind>("idle");
  const [label, setLabel] = useState<string>("");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Two springs of different stiffness — the inner dot tracks directly,
  // the outer ring lags behind for a trailing feel.
  const dotSpring = { stiffness: 1200, damping: 60, mass: 0.2 };
  const ringSpring = { stiffness: 240, damping: 26, mass: 0.45 };
  const dotX = useSpring(x, dotSpring);
  const dotY = useSpring(y, dotSpring);
  const ringX = useSpring(x, ringSpring);
  const ringY = useSpring(y, ringSpring);

  useEffect(() => {
    if (!mounted || reduce) return;

    // Only enable on fine-pointer devices (desktop mice / trackpads).
    const media = window.matchMedia("(pointer: fine)");
    if (!media.matches) return;

    document.body.dataset.customCursor = "true";

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const over = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>(
        "[data-cursor], a, button",
      );
      if (!el) {
        setHover("idle");
        setLabel("");
        return;
      }
      const explicit = el.getAttribute("data-cursor");
      if (explicit) {
        setHover("cta");
        setLabel(explicit);
        return;
      }
      setHover("link");
      setLabel("");
    };

    const out = () => setVisible(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", out);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", out);
      delete document.body.dataset.customCursor;
    };
  }, [mounted, reduce, visible, x, y]);

  if (!mounted || reduce) return null;

  const ringSize = hover === "cta" ? 88 : hover === "link" ? 44 : 28;

  return (
    <>
      {/* Outer ring (trailing) */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[70] flex items-center justify-center rounded-full border border-accent/60 mix-blend-difference"
        style={{
          x: ringX,
          y: ringY,
          width: ringSize,
          height: ringSize,
          marginLeft: -ringSize / 2,
          marginTop: -ringSize / 2,
          opacity: visible ? 1 : 0,
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          marginLeft: -ringSize / 2,
          marginTop: -ringSize / 2,
        }}
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
      >
        {hover === "cta" && label && (
          <span className="font-mono text-[0.62rem] tracking-widest uppercase text-fg">
            {label}
          </span>
        )}
      </motion.div>

      {/* Inner dot (precise) */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[71] h-1.5 w-1.5 -ml-[3px] -mt-[3px] rounded-full bg-accent mix-blend-difference"
        style={{ x: dotX, y: dotY, opacity: visible ? 1 : 0 }}
      />
    </>
  );
}
