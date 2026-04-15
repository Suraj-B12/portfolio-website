// Photo manifest. Files live in /public/photography/.

export type Photo = {
  id: string;
  src: string;
  alt: string;
  // Aspect ratio controls masonry layout. Common values:
  // "3/4" (portrait), "4/3" (landscape), "1/1" (square), "16/9" (wide)
  aspect: "3/4" | "4/3" | "1/1" | "16/9" | "2/3" | "3/2";
  caption?: string;
};

export const photos: readonly Photo[] = [
  {
    id: "p1",
    src: "/photography/01.jpg",
    alt: "Motorcycle parked in Bengaluru, 2025",
    aspect: "3/4",
    caption: "Bengaluru · 2025",
  },
  {
    id: "p2",
    src: "/photography/02.jpg",
    alt: "College fest performance photograph, 2025",
    aspect: "16/9",
    caption: "College fest · 2025",
  },
  {
    id: "p3",
    src: "/photography/03.jpg",
    alt: "Portrait session photograph",
    aspect: "1/1",
    caption: "Portrait session",
  },
  {
    id: "p4",
    src: "/photography/04.jpg",
    alt: "Band collaboration photograph",
    aspect: "4/3",
    caption: "Band collaboration",
  },
  {
    id: "p5",
    src: "/photography/05.jpg",
    alt: "Street photograph, 2024",
    aspect: "3/4",
    caption: "Street · 2024",
  },
  {
    id: "p6",
    src: "/photography/09.jpg",
    alt: "Live event photograph",
    aspect: "2/3",
    caption: "Live event",
  },
  {
    id: "p7",
    src: "/photography/07.jpg",
    alt: "Photograph color graded in DaVinci Resolve",
    aspect: "3/2",
    caption: "Color graded in Resolve",
  },
  {
    id: "p8",
    src: "/photography/08.jpg",
    alt: "Studio photograph",
    aspect: "1/1",
    caption: "Studio",
  },
];
