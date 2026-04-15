"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";

import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { EASE } from "@/lib/motion";
import { useMounted } from "@/lib/useMounted";
import { photos, type Photo } from "@/data/photography";

const aspectPadding: Record<Photo["aspect"], string> = {
  "3/4": "133.33%",
  "2/3": "150%",
  "4/3": "75%",
  "3/2": "66.66%",
  "1/1": "100%",
  "16/9": "56.25%",
};

// Tiny 1x1 cream-tinted data URL used as a blur placeholder while next/image
// loads the optimized version. Keeps the grid looking intentional during load.
const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxIDEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMxYTFhMWEiLz48L3N2Zz4=";

export function Photography() {
  return (
    <section
      id="photography"
      aria-label="Photography"
      className="relative bg-bg"
    >
      <div className="container-x section-pad">
        <SectionHeader
          index="04"
          eyebrow="Photography"
          heading="The other side of the keyboard."
          headingAccent="keyboard."
          description="RAW files, color curves in DaVinci Resolve, band collaborations, college fest events. Falcons Media Club, BMSCE."
        />

        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [column-fill:_balance]">
          {photos.map((photo, i) => (
            <PhotoCard key={photo.id} photo={photo} index={i} />
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-16 text-center mono-label text-fg-muted">
            / More on Instagram, coming soon
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function PhotoCard({ photo, index }: { photo: Photo; index: number }) {
  const mounted = useMounted();
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const className =
    "mb-5 break-inside-avoid group relative overflow-hidden rounded-xl border border-border-dark bg-bg-surface/40";

  const inner = (
    <>
      <div
        className="relative w-full"
        style={{ paddingBottom: aspectPadding[photo.aspect] }}
      >
        {/* Skeleton / error state. Sits under the image until it loads. */}
        {(!loaded || errored) && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 50%, #1a1a1a 100%)",
            }}
          >
            <span className="mono-label text-fg-muted rotate-[-4deg]">
              {errored ? "(image missing)" : "loading…"}
            </span>
          </div>
        )}

        {/*
          next/image handles the heavy lifting:
          - Auto-generates WebP/AVIF at several widths
          - Responsive srcset driven by the `sizes` hint
          - Lazy loads below the fold by default
          - blur placeholder avoids the flash while the optimized asset streams in
        */}
        {!errored && (
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            className={`object-cover transition-all duration-700 ${
              loaded
                ? "opacity-100 group-hover:scale-[1.03]"
                : "opacity-0"
            }`}
          />
        )}

        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-bg/90 via-bg/20 to-transparent" />
      </div>

      {photo.caption && (
        <figcaption className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0">
          <span className="mono-label text-fg bg-bg/60 backdrop-blur-sm px-3 py-1.5 rounded-full inline-block">
            {photo.caption}
          </span>
        </figcaption>
      )}
    </>
  );

  if (!mounted) {
    return <figure className={className}>{inner}</figure>;
  }

  return (
    <motion.figure
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: index * 0.06, ease: EASE }}
      className={className}
    >
      {inner}
    </motion.figure>
  );
}
