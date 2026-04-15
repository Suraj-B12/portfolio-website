import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { aboutParagraphs } from "@/data/about";
import { doWell } from "@/data/skills";

export function About() {
  return (
    <section
      id="about"
      aria-label="About Suraj"
      data-theme="warm"
      className="relative bg-bg-warm text-fg-warm"
    >
      {/* Paper texture overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 15%, #000 1px, transparent 1px), radial-gradient(circle at 75% 85%, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px, 60px 60px",
        }}
      />

      <div className="container-x relative section-pad">
        <SectionHeader
          index="02"
          eyebrow="About"
          theme="warm"
          heading="Systems person first, engineer second."
        />

        <div className="grid gap-16 md:grid-cols-12">
          {/* Positioning quote */}
          <div className="md:col-span-5">
            <Reveal>
              <div className="sticky top-32 flex flex-col gap-8">
                <p className="mono-label text-fg-warm-muted">/ Who I am</p>
                <p className="font-display text-fg-warm text-3xl md:text-4xl leading-[1.1] tracking-[-0.02em]">
                  I&rsquo;m not the loudest voice in the room.
                  <span className="text-accent">
                    {" "}
                    I&rsquo;m the one who&rsquo;s already drawing the diagram.
                  </span>
                </p>
                <div className="flex items-center gap-3 text-fg-warm-secondary">
                  <span className="h-px w-10 bg-fg-warm-muted" />
                  <span className="mono-label">
                    BMSCE Bengaluru · Class of 2027
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Prose */}
          <div className="md:col-span-7 flex flex-col gap-7">
            {aboutParagraphs.map((paragraph, i) => (
              <Reveal key={paragraph} delay={0.08 * i}>
                <p className="text-fg-warm text-lg md:text-xl leading-[1.6] tracking-[-0.005em]">
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* "What I actually do well" list */}
        <div className="mt-24 md:mt-32">
          <Reveal>
            <div className="mb-10 flex items-center gap-4">
              <span className="mono-label text-accent">( 02.1 )</span>
              <span className="mono-label text-fg-warm-muted">
                What I actually do well
              </span>
            </div>
          </Reveal>

          <ul className="flex flex-col divide-y divide-border-warm border-y border-border-warm">
            {doWell.map((line, i) => (
              <Reveal
                key={line}
                as="li"
                delay={0.05 * i}
                className="group grid grid-cols-[3rem_1fr] items-baseline gap-6 py-6 md:py-8"
              >
                <span className="mono-label text-fg-warm-muted">
                  / 0{i + 1}
                </span>
                <span className="font-display text-fg-warm text-2xl md:text-3xl leading-snug tracking-[-0.01em] group-hover:text-accent transition-colors duration-300">
                  {line}
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
