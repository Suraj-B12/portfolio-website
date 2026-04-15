"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

import { MetaCell } from "@/components/MetaCell";
import { Reveal } from "@/components/Reveal";
import { EASE } from "@/lib/motion";
import { useMounted } from "@/lib/useMounted";
import { site } from "@/data/site";

export function Contact() {
  return (
    <section
      id="contact"
      aria-label="Contact"
      className="relative overflow-hidden bg-bg"
    >
      <div className="container-x relative section-pad flex flex-col items-center justify-center text-center">
        <Reveal>
          <div className="mb-8 flex items-center justify-center gap-4">
            <span className="mono-label text-accent">( 06 )</span>
            <span className="mono-label text-fg-muted">Let&rsquo;s talk</span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="font-display text-fg font-medium tracking-[-0.035em] leading-[0.88] text-[clamp(2.5rem,10vw,9rem)] max-w-[16ch]">
            Building something
            <span className="text-accent italic"> interesting?</span>
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-10 max-w-xl text-fg-secondary text-lg md:text-xl leading-relaxed">
            Looking for roles starting mid-2026. If you&rsquo;re hiring for
            software, data, or AI and want someone who thinks before typing,
            drop a line.
          </p>
        </Reveal>

        {/* Primary CTA */}
        <Reveal delay={0.3}>
          <motion.a
            href={`mailto:${site.email}?subject=Hi%20Suraj`}
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="group mt-14 inline-flex items-center gap-4 rounded-full border border-accent/60 bg-accent/5 pl-8 pr-3 py-3 text-accent hover:border-accent hover:bg-accent hover:text-bg transition-colors duration-300"
          >
            <span className="font-display text-lg md:text-xl relative">
              {site.email}
              <span
                aria-hidden
                className="absolute inset-x-0 -bottom-0.5 h-px bg-current scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
              />
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-bg transition-transform duration-300 group-hover:rotate-45 group-hover:bg-bg group-hover:text-accent">
              →
            </span>
          </motion.a>
        </Reveal>

        {/* Social links */}
        <Reveal delay={0.4}>
          <div className="mt-14 flex items-center gap-8 md:gap-12">
            <SocialLink href={site.github} label="GitHub" handle="@Suraj-B12" />
            <span aria-hidden className="h-4 w-px bg-border-dark" />
            <SocialLink
              href={site.linkedin}
              label="LinkedIn"
              handle="br-suraj"
            />
          </div>
        </Reveal>

        <FooterBar />
      </div>
    </section>
  );
}

function SocialLink({
  href,
  label,
  handle,
}: {
  href: string;
  label: string;
  handle: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="group flex flex-col items-start gap-1 md:flex-row md:items-baseline md:gap-3"
    >
      <span className="mono-label text-fg-muted group-hover:text-accent transition-colors duration-300">
        {label}
      </span>
      <span
        data-link
        className="text-fg"
      >
        {handle}{" "}
        <span className="opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 inline-block">
          ↗
        </span>
      </span>
    </a>
  );
}

function FooterBar() {
  const mounted = useMounted();
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      const ss = String(d.getSeconds()).padStart(2, "0");
      setTime(`IST ${hh}:${mm}:${ss}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const cells = (
    <>
      <MetaCell label="Version" value="v1.0 · 2026" muted prefix />
      <MetaCell label="Build" value="Next.js · Vercel" muted prefix />
      <MetaCell label="Font" value="Satoshi · JetBrains Mono" muted prefix />
      <MetaCell label="Local time" value={time || "—"} muted mono prefix />
    </>
  );

  const className =
    "mt-24 w-full border-t border-border-dark pt-8 grid grid-cols-2 gap-4 md:grid-cols-4 text-left";

  if (!mounted) {
    return <div className={className}>{cells}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
      className={className}
    >
      {cells}
    </motion.div>
  );
}
