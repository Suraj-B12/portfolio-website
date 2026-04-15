import type { ReactNode } from "react";

import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/cn";

type Props = {
  /** Roman-style index, e.g. "01", "02.1" */
  index: string;
  /** Monospace eyebrow label, e.g. "Selected Work" */
  eyebrow: string;
  /** Full heading text. Wrapped in HeadingScramble so it scramble-reveals
   *  when it enters the viewport. */
  heading?: string;
  /** Substring of `heading` that should render in the accent color. Must
   *  appear verbatim in `heading`. */
  headingAccent?: string;
  /** Optional description paragraph below the heading */
  description?: ReactNode;
  /** Applies warm-theme colors when the parent section uses `data-theme="warm"` */
  theme?: "dark" | "warm";
};

export function SectionHeader({
  index,
  eyebrow,
  heading,
  headingAccent,
  description,
  theme = "dark",
}: Props) {
  const isWarm = theme === "warm";
  return (
    <Reveal className="mb-14 flex flex-col gap-5 md:mb-20 md:flex-row md:items-end md:justify-between">
      <div className="flex items-center gap-4">
        <span className="mono-label text-accent">( {index} )</span>
        <span
          className={cn(
            "mono-label",
            isWarm ? "text-fg-warm-muted" : "text-fg-muted",
          )}
        >
          {eyebrow}
        </span>
      </div>
      {(heading || description) && (
        <div className="max-w-2xl">
          {heading && (
            <h2
              className={cn(
                "font-display font-medium tracking-[-0.03em] leading-[0.95] text-4xl md:text-6xl",
                isWarm ? "text-fg-warm" : "text-fg",
              )}
            >
              {headingAccent && heading.includes(headingAccent)
                ? (() => {
                    const [before, after] = heading.split(headingAccent);
                    return (
                      <>
                        {before}
                        <span className="text-accent">{headingAccent}</span>
                        {after}
                      </>
                    );
                  })()
                : heading}
            </h2>
          )}
          {description && (
            <p
              className={cn(
                "mt-6 text-base md:text-lg max-w-lg",
                isWarm ? "text-fg-warm-secondary" : "text-fg-secondary",
              )}
            >
              {description}
            </p>
          )}
        </div>
      )}
    </Reveal>
  );
}
