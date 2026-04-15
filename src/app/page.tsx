import { Navigation } from "@/components/Navigation";
import { About } from "@/components/sections/About";
import { Achievements } from "@/components/sections/Achievements";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Photography } from "@/components/sections/Photography";
import { Skills } from "@/components/sections/Skills";
import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="relative">
        <Hero />
        <Work />
        <About />
        <Skills />
        <Photography />
        <Achievements />
        <Contact />
      </main>
    </>
  );
}
