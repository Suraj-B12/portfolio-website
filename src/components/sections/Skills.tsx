import { MetaCell } from "@/components/MetaCell";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { SkillLogo } from "@/components/SkillLogo";
import { skillGroups } from "@/data/skills";

export function Skills() {
  return (
    <section id="skills" aria-label="Skills" className="relative bg-bg">
      <div className="container-x pt-32 pb-16 md:pt-40 md:pb-20">
        <SectionHeader
          index="03"
          eyebrow="Toolbox"
          heading="What I reach for when I'm actually building."
          headingAccent="actually building."
        />
      </div>

      <ol className="flex flex-col">
        {skillGroups.map((group, gi) => (
          <CategoryBlock
            key={group.id}
            index={`03.${gi + 1}`}
            label={group.label}
            items={[...group.items]}
          />
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function CategoryBlock({
  index,
  label,
  items,
}: {
  index: string;
  label: string;
  items: string[];
}) {
  const count = String(items.length).padStart(2, "0");

  return (
    <li className="relative border-t border-border-dark last:border-b-0">
      <div className="container-x py-12 md:py-20">
        {/* Metadata bar — mirrors Work's 3fr/1fr split */}
        <Reveal className="mb-10 grid grid-cols-[3fr_1fr] items-end border-b border-border-dark/50 pb-6">
          <div className="flex gap-x-12">
            <MetaCell label="Index" value={index} mono />
            <MetaCell label="Category" value={label} mono />
            <MetaCell
              label="Items"
              value={count}
              mono
              accent
            />
          </div>
          {/* Right half: count anchored to right corner, decorative */}
          <div className="select-none text-right font-display text-fg-faint text-5xl md:text-7xl leading-none">
            /{count}
          </div>
        </Reveal>

        {/* Title + logo grid — 7/5 split like Work */}
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal delay={0.05}>
              <h3 className="font-display font-medium tracking-[-0.03em] leading-[0.95] text-[clamp(2.25rem,6vw,5.5rem)] text-fg">
                {label}
              </h3>
            </Reveal>
          </div>

          <div className="md:col-span-7 md:pl-6">
            <Reveal delay={0.2}>
              <ul className="flex flex-wrap gap-3 md:gap-4">
                {items.map((item) => (
                  <li key={item}>
                    <SkillLogo name={item} />
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </li>
  );
}
