import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { achievements } from "@/data/achievements";

export function Achievements() {
  return (
    <section
      id="achievements"
      aria-label="Achievements"
      data-theme="warm"
      className="relative bg-bg-warm text-fg-warm"
    >
      <div className="container-x section-pad">
        <SectionHeader
          index="05"
          eyebrow="Recognised"
          theme="warm"
          heading="When experts thought the work was worth it."
          headingAccent="work was worth it."
        />

        <ul className="flex flex-col divide-y divide-border-warm border-y border-border-warm">
          {achievements.map((item, i) => (
            <Reveal
              key={item.id}
              as="li"
              delay={i * 0.1}
              className="grid grid-cols-1 gap-8 py-10 md:grid-cols-12 md:py-14"
            >
              <div className="md:col-span-3">
                <div className="font-display text-accent font-medium tracking-[-0.02em] text-4xl md:text-5xl leading-none">
                  {item.rank}
                </div>
                <div className="mono-label text-fg-warm-muted mt-3">
                  {item.date}
                </div>
              </div>

              <div className="md:col-span-5">
                <h3 className="font-display text-fg-warm text-2xl md:text-3xl font-medium leading-tight tracking-[-0.015em]">
                  {item.title}
                </h3>
                <p className="mono-label text-fg-warm-muted mt-3">
                  @ {item.venue}
                </p>
              </div>

              <div className="md:col-span-4 flex flex-col gap-4">
                <p className="text-fg-warm-secondary text-[15px] md:text-base leading-relaxed">
                  {item.description}
                </p>
                <span className="mono-label self-start rounded-full border border-border-warm px-3 py-1 text-fg-warm-muted">
                  {item.tag}
                </span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
