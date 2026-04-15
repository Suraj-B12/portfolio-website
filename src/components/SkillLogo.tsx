"use client";

import { useState } from "react";
import { skillIcons } from "@/data/skillIcons";

/**
 * Premium skill tile — no chrome at rest, just the logo in monochrome
 * cream. On hover, the logo colorizes to the brand hex, the tile gains
 * a subtle warm surface + 1px edge, and lifts. Tooltip below shows the
 * tool's real name only.
 */
export function SkillLogo({ name }: { name: string }) {
  const icon = skillIcons[name];
  const [hover, setHover] = useState(false);

  if (!icon) return null;

  return (
    <div
      className="group relative flex h-16 w-16 items-center justify-center rounded-lg border border-transparent transition-all duration-300 ease-out hover:-translate-y-1 hover:border-fg-faint hover:bg-bg-surface/60 md:h-20 md:w-20"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {icon.kind === "svg" ? (
        <svg
          viewBox={icon.viewBox ?? "0 0 24 24"}
          aria-hidden
          className="h-9 w-9 transition-colors duration-300 md:h-11 md:w-11"
          style={{
            color: hover ? `#${icon.hex}` : "var(--fg-muted)",
          }}
        >
          <path d={icon.path} fill="currentColor" />
        </svg>
      ) : (
        <span
          className="font-mono text-sm font-medium tracking-tight transition-colors duration-300 md:text-base"
          style={{ color: hover ? "var(--accent)" : "var(--fg-muted)" }}
        >
          {icon.text}
        </span>
      )}

      {/* Tooltip — name only, appears on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border-dark bg-bg-deep px-2.5 py-1 font-mono text-[0.7rem] text-fg-secondary opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100"
      >
        {icon.label}
      </span>

      <span className="sr-only">{icon.label}</span>
    </div>
  );
}
