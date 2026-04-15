import { MetaCell } from "@/components/MetaCell";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { projects, type Project, type ProjectStatus } from "@/data/projects";

const statusLabels: Record<ProjectStatus, string> = {
  live: "Live",
  "in-progress": "In progress",
  archived: "Archived",
};

export function Work() {
  return (
    <section id="work" aria-label="Selected work" className="relative bg-bg">
      <div className="container-x pt-32 pb-16 md:pt-40 md:pb-20">
        <SectionHeader
          index="01"
          eyebrow="Selected Work"
          heading="Things I’ve built that are actually out in the world."
          headingAccent="actually out in the world."
        />
      </div>

      <ol className="flex flex-col">
        {projects.map((project) => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </ol>
    </section>
  );
}

function ProjectItem({ project }: { project: Project }) {
  const liveHref = project.links.live;
  const repoHref = project.links.repo;

  return (
    <li
      className="relative border-t border-border-dark last:border-b-0"
      data-project={project.id}
    >
      <div className="container-x py-12 md:py-20">
        {/* Metadata bar — 50/50 split: left = meta cells, right = year */}
        <Reveal className="mb-10 grid grid-cols-[3fr_1fr] items-end border-b border-border-dark/50 pb-6">
          {/* Left 75%: meta cells spread comfortably with room to breathe */}
          <div className="flex gap-x-12">
            <MetaCell label="Index" value={project.index} mono />
            <MetaCell label="Type" value={project.type} mono />
            <MetaCell label="Context" value={project.context} mono />
            <MetaCell
              label="Status"
              value={statusLabels[project.status]}
              mono
              accent={project.status === "live"}
            />
          </div>
          {/* Right half: year anchored to right corner */}
          <div className="text-right font-display text-fg-faint text-5xl md:text-7xl leading-none select-none">
            /{project.year}
          </div>
        </Reveal>

        {/* Title + description */}
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal delay={0.05}>
              <h3 className="font-display font-medium tracking-[-0.03em] leading-[0.95] text-[clamp(2.25rem,6vw,5.5rem)] text-fg">
                {project.title}
              </h3>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-4 max-w-md text-fg-secondary text-base md:text-lg">
                {project.subtitle}
              </p>
            </Reveal>
          </div>

          <div className="md:col-span-5 md:pl-6 flex flex-col gap-6">
            <Reveal delay={0.2}>
              <p className="text-fg-secondary leading-relaxed text-[15px] md:text-base">
                {project.body}
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <ul className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="mono-label text-fg-secondary border border-border-dark rounded-full px-3 py-1"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* CTA row — only these are clickable, not the whole card */}
            <Reveal delay={0.4}>
              <div className="flex items-center gap-6 mt-2">
                {liveHref ? (
                  <a
                    href={liveHref}
                    target="_blank"
                    rel="noreferrer noopener"
                    data-link
                    className="mono-label text-accent"
                  >
                    {project.type === "Android app"
                      ? "Download APK"
                      : "Visit site"}
                    <span aria-hidden>→</span>
                  </a>
                ) : project.status === "in-progress" ? (
                  <span className="mono-label text-fg-muted inline-flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                    In progress
                  </span>
                ) : repoHref ? (
                  <a
                    href={repoHref}
                    target="_blank"
                    rel="noreferrer noopener"
                    data-link
                    className="mono-label text-fg-muted"
                  >
                    Repo on GitHub
                    <span aria-hidden>→</span>
                  </a>
                ) : null}
                {project.highlight && (
                  <span className="mono-label text-fg-muted border-l border-border-dark pl-6">
                    {project.highlight}
                  </span>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

    </li>
  );
}
