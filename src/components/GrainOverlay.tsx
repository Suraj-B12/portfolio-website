/**
 * Full-viewport fractal-noise overlay. Fixed position, pointer-events:none,
 * mix-blend-mode: overlay at very low opacity. This unifies the look of
 * both the dark and warm sections so the scroll-linked background feels
 * like one continuous environment instead of two tones cut together.
 *
 * Pure SVG data URL — no network request, no runtime cost.
 */
export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] mix-blend-overlay opacity-[0.06]"
      style={{
        backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>
            <filter id='n'>
              <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>
              <feColorMatrix type='saturate' values='0'/>
            </filter>
            <rect width='100%' height='100%' filter='url(#n)'/>
          </svg>`,
        )}")`,
        backgroundSize: "300px 300px",
      }}
    />
  );
}
