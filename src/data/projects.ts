export type ProjectStatus = "live" | "in-progress" | "archived";

export type Project = {
  id: string;
  index: string; // e.g. "01"
  title: string;
  subtitle: string;
  type: string; // e.g. "Real-time dashboard"
  year: string; // e.g. "2025"
  context: string; // e.g. "Amagi Media Labs"
  description: string;
  body: string; // longer paragraph
  stack: readonly string[];
  links: {
    live?: string;
    repo?: string;
  };
  status: ProjectStatus;
  highlight?: string; // one-line outcome, e.g. "Finalist at Amagination 2025"
};

export const projects: readonly Project[] = [
  {
    id: "hls-monitor",
    index: "01",
    title: "HLS Monitoring Dashboard",
    subtitle: "Real-time stream health for live broadcast",
    type: "Real-time dashboard",
    year: "2025",
    context: "Amagi Media Labs · Learning Hub",
    description:
      "A real-time dashboard that monitors live HLS streams, the protocol behind most of the live video on the internet.",
    body:
      "The system polls stream manifests every few seconds, detects stale playlists and sequence jumps, computes a 0 to 100 health score, and pushes everything to the browser over WebSockets. FFmpeg runs under the hood to pull video metadata, generate live thumbnails, and catch silent audio. Built in two weeks during Amagi's Learning Hub with access to their engineers. Shipped, deployed, and made it to finalist at Amagination 2025.",
    stack: [
      "Node.js",
      "React",
      "MongoDB",
      "Socket.io",
      "Docker",
      "FFmpeg",
    ],
    links: {
      live: "https://hls-monitor.onrender.com",
      repo: "https://github.com/Suraj-B12",
    },
    status: "live",
    highlight: "Finalist · Amagination 2025",
  },
  {
    id: "retrocam",
    index: "02",
    title: "RetroCam",
    subtitle: "Instant camera app with a social feed",
    type: "Android app",
    year: "2026",
    context: "Personal project",
    description:
      "An instant photo app that does what vintage cameras did best. Capture a moment, apply a nostalgic filter, share it with people who get it.",
    body:
      "Shoot directly or pick from gallery, everything cropped to a 3:4 polaroid ratio. Ten filters (Vintage, Noir, Retro Pop, Faded, and more) built with color matrix transforms, not Instagram presets. Works offline. Photos, filters, and captions sync when you're back online. Firebase for accounts and the social feed, Cloudinary for image hosting, OneSignal for push notifications. Friends actually registered and used it. Started as a college mini-project. The social feed, filters, and notification system were scope I added beyond the brief.",
    stack: [
      "Kotlin",
      "Android SDK",
      "Firebase",
      "Cloudinary",
      "Room",
      "OneSignal",
    ],
    links: {
      live: "https://drive.google.com/file/d/1WOMT2TF0tEXQVd40LJoKvJJR7ky3rlLW/view?usp=sharing",
      repo: "https://github.com/Suraj-B12",
    },
    status: "live",
  },
  {
    id: "geoai",
    index: "03",
    title: "GeoAI",
    subtitle: "Pavement distress detection for Indian roads",
    type: "Capstone · AI pipeline",
    year: "2026",
    context: "BMSCE Capstone",
    description:
      "A vision system that classifies road damage from citizen photographs and plots severity on an interactive map.",
    body:
      "Citizens photograph potholes, cracks, and surface wear with their phones, GPS gets captured automatically. A locally-run Qwen 2.5 7B vision model, fine-tuned with QLoRA on pavement-specific data, classifies the damage type and severity. Results are plotted on an interactive map so authorities can plan maintenance based on real data instead of complaint calls. Team of three. I'm handling the AI pipeline: model hosting, input validation, processing, evaluation on real road segments, and the fine-tuning itself.",
    stack: [
      "Python",
      "Qwen 2.5 7B",
      "QLoRA",
      "GIS",
      "PyTorch",
    ],
    links: {
      repo: "https://github.com/Suraj-B12",
    },
    status: "in-progress",
    highlight: "Capstone project · Delivery July 2026",
  },
] as const;
