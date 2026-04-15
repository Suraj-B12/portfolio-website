import { cn } from "@/lib/cn";

type Props = {
  label: string;
  value: string;
  /** Show value in accent color */
  accent?: boolean;
  /** Render value in monospace */
  mono?: boolean;
  /** Prefix label with `/ ` (used by footer cells) */
  prefix?: boolean;
  /** Use muted value color (footer-style) */
  muted?: boolean;
};

/**
 * Small "label over value" cell used by hero, project metadata bar,
 * and footer. Intentionally minimal — callers pass styled strings.
 */
export function MetaCell({
  label,
  value,
  accent,
  mono,
  prefix,
  muted,
}: Props) {
  return (
    <div className="flex flex-col gap-1">
      <span className="mono-label text-fg-muted">
        {prefix ? `/ ${label}` : label}
      </span>
      <span
        className={cn(
          "text-sm md:text-base",
          accent && "text-accent",
          !accent && muted && "text-fg-secondary",
          !accent && !muted && "text-fg",
          mono && "font-mono tabular-nums",
        )}
      >
        {value}
      </span>
    </div>
  );
}
