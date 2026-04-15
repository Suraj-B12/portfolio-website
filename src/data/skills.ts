export type SkillTagColor = "blue" | "teal" | "pink" | "amber" | "gray";

export type SkillGroup = {
  id: string;
  label: string;
  color: SkillTagColor;
  items: readonly string[];
};

export const skillGroups: readonly SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    color: "amber",
    items: ["Python", "C", "Java", "SQL", "JavaScript", "Kotlin", "TypeScript"],
  },
  {
    id: "frontend",
    label: "Frontend",
    color: "blue",
    items: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
  },
  {
    id: "backend",
    label: "Backend",
    color: "teal",
    items: ["Node.js", "Express", "Socket.io", "REST APIs"],
  },
  {
    id: "mobile",
    label: "Mobile",
    color: "pink",
    items: ["Android SDK", "Kotlin", "Material Design 3", "Room"],
  },
  {
    id: "data",
    label: "Data & AI",
    color: "amber",
    items: [
      "QLoRA fine-tuning",
      "Qwen 2.5 VL",
      "Isolation Forest",
      "Scikit-Learn",
      "Pandas",
    ],
  },
  {
    id: "infra",
    label: "Infra & Tools",
    color: "gray",
    items: [
      "Docker",
      "Git",
      "MongoDB",
      "PostgreSQL",
      "Firebase",
      "Cloudinary",
      "Vercel",
      "Render",
    ],
  },
];

export const doWell: readonly string[] = [
  "Break a vague idea into something buildable.",
  "Research a domain until I understand how it actually works.",
  "Design system architecture. What talks to what, and why.",
  "Ship working software people can use, not code that just compiles.",
  "Photograph things and make them look better than they did in real life.",
];
