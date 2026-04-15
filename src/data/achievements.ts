export type Achievement = {
  id: string;
  rank: string; // e.g. "Top 11 / 450+"
  title: string;
  venue: string;
  date: string; // month + year
  description: string;
  tag: string; // one-word category
};

export const achievements: readonly Achievement[] = [
  {
    id: "visa-iitm",
    rank: "Top 11 / 450+",
    title: "Data Quality Scoring Engine",
    venue: "Visa Hackathon · IIT Madras",
    date: "Jan 2026",
    description:
      "24-hour offline hackathon. Built an engine that scores payment transaction data across completeness, accuracy, consistency, validity, and timeliness. Rule-based checks for the hard business logic, Isolation Forest for the anomalies rules miss.",
    tag: "Hackathon",
  },
  {
    id: "amagination-2025",
    rank: "Finalist",
    title: "Amagination 2025",
    venue: "Amagi Media Labs",
    date: "2025",
    description:
      "Shipped the HLS Monitoring Dashboard during Amagi's Learning Hub initiative. Selected as a finalist and awarded at Amagi's office.",
    tag: "Industry",
  },
] as const;
