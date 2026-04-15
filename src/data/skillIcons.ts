import {
  siPython,
  siC,
  siMysql,
  siJavascript,
  siKotlin,
  siTypescript,
  siReact,
  siNextdotjs,
  siTailwindcss,
  siFramer,
  siNodedotjs,
  siExpress,
  siSocketdotio,
  siAndroid,
  siMaterialdesign,
  siScikitlearn,
  siPandas,
  siDocker,
  siGit,
  siMongodb,
  siPostgresql,
  siFirebase,
  siCloudinary,
  siVercel,
  siRender,
} from "simple-icons";

export type SkillIcon =
  | { kind: "svg"; path: string; hex: string; label: string; viewBox?: string }
  | { kind: "text"; text: string; label: string };

/**
 * Maps a skill name (from skills.ts) to either a brand SVG icon or a
 * text fallback for tools without clean brand logos.
 * Brand colors come straight from simple-icons so the "colorize on
 * hover" trick uses the real brand hex.
 */
export const skillIcons: Record<string, SkillIcon> = {
  // Languages
  Python: { kind: "svg", path: siPython.path, hex: siPython.hex, label: "Python" },
  C: { kind: "svg", path: siC.path, hex: siC.hex, label: "C" },
  Java: { kind: "svg", path: "M47.617 98.12c-19.192 5.362 11.677 16.439 36.115 5.969-4.003-1.556-6.874-3.351-6.874-3.351-10.897 2.06-15.952 2.222-25.844 1.092-8.164-.935-3.397-3.71-3.397-3.71zm33.189-10.46c-14.444 2.779-22.787 2.69-33.354 1.6-8.171-.845-2.822-4.805-2.822-4.805-21.137 7.016 11.767 14.977 41.309 6.336-3.14-1.106-5.133-3.131-5.133-3.131zm11.319-60.575c.001 0-42.731 10.669-22.323 34.187 6.024 6.935-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.793 15.634-29.58zm9.998 81.144s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.095.171-4.45-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.952-3.487-32.013 6.85-13.742 9.815 49.821 8.076 90.817-3.637 77.896-9.468zM85 77.896c2.395-1.634 5.703-3.053 5.703-3.053s-9.424 1.685-18.813 2.474c-11.494.964-23.823 1.154-30.012.326-14.652-1.959 8.033-7.348 8.033-7.348s-8.812-.596-19.644 4.644C17.455 81.134 61.958 83.958 85 77.896zm5.609 15.145c-.108.29-.468.616-.468.616 31.273-8.221 19.775-28.979 4.822-23.725-1.312.464-2 1.543-2 1.543s.829-.334 2.678-.72c7.559-1.575 18.389 10.119-5.032 22.286zM64.181 70.069c-4.614-10.429-20.26-19.553.007-35.559C89.459 14.563 76.492 1.587 76.492 1.587c5.23 20.608-18.451 26.833-26.999 39.667-5.821 8.745 2.857 18.142 14.688 28.815zm27.274 51.748c-19.187 3.612-42.854 3.191-56.887.874 0 0 2.874 2.38 17.646 3.331 22.476 1.437 57-.8 57.816-11.436.001 0-1.57 4.032-18.575 7.231z", hex: "F89820", label: "Java", viewBox: "0 0 128 128" },
  SQL: { kind: "svg", path: siMysql.path, hex: siMysql.hex, label: "SQL" },
  JavaScript: { kind: "svg", path: siJavascript.path, hex: siJavascript.hex, label: "JavaScript" },
  Kotlin: { kind: "svg", path: siKotlin.path, hex: siKotlin.hex, label: "Kotlin" },
  TypeScript: { kind: "svg", path: siTypescript.path, hex: siTypescript.hex, label: "TypeScript" },

  // Frontend
  React: { kind: "svg", path: siReact.path, hex: siReact.hex, label: "React" },
  "Next.js": { kind: "svg", path: siNextdotjs.path, hex: "FFFFFF", label: "Next.js" },
  "Tailwind CSS": { kind: "svg", path: siTailwindcss.path, hex: siTailwindcss.hex, label: "Tailwind CSS" },
  "Framer Motion": { kind: "svg", path: siFramer.path, hex: siFramer.hex, label: "Framer Motion" },

  // Backend
  "Node.js": { kind: "svg", path: siNodedotjs.path, hex: siNodedotjs.hex, label: "Node.js" },
  Express: { kind: "svg", path: siExpress.path, hex: "FFFFFF", label: "Express" },
  "Socket.io": { kind: "svg", path: siSocketdotio.path, hex: "FFFFFF", label: "Socket.io" },
  "REST APIs": { kind: "text", text: "REST", label: "REST APIs" },

  // Mobile
  "Android SDK": { kind: "svg", path: siAndroid.path, hex: siAndroid.hex, label: "Android SDK" },
  "Material Design 3": { kind: "svg", path: siMaterialdesign.path, hex: siMaterialdesign.hex, label: "Material Design 3" },
  Room: { kind: "text", text: "Room", label: "Room" },

  // Data & AI
  "QLoRA fine-tuning": { kind: "text", text: "QLoRA", label: "QLoRA fine-tuning" },
  "Qwen 2.5 VL": { kind: "text", text: "Qwen", label: "Qwen 2.5 VL" },
  "Isolation Forest": { kind: "text", text: "iForest", label: "Isolation Forest" },
  "Scikit-Learn": { kind: "svg", path: siScikitlearn.path, hex: siScikitlearn.hex, label: "Scikit-Learn" },
  Pandas: { kind: "svg", path: siPandas.path, hex: "E1E1E1", label: "Pandas" },

  // Infra & Tools
  Docker: { kind: "svg", path: siDocker.path, hex: siDocker.hex, label: "Docker" },
  Git: { kind: "svg", path: siGit.path, hex: siGit.hex, label: "Git" },
  MongoDB: { kind: "svg", path: siMongodb.path, hex: siMongodb.hex, label: "MongoDB" },
  PostgreSQL: { kind: "svg", path: siPostgresql.path, hex: siPostgresql.hex, label: "PostgreSQL" },
  Firebase: { kind: "svg", path: siFirebase.path, hex: siFirebase.hex, label: "Firebase" },
  Cloudinary: { kind: "svg", path: siCloudinary.path, hex: siCloudinary.hex, label: "Cloudinary" },
  Vercel: { kind: "svg", path: siVercel.path, hex: "FFFFFF", label: "Vercel" },
  Render: { kind: "svg", path: siRender.path, hex: "FFFFFF", label: "Render" },
};
