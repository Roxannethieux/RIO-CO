import type { Metadata } from "next";
import Hero from "@/components/Hero";
import SpecialtiesTeaser from "@/components/SpecialtiesTeaser";
import ProjectSteps from "@/components/ProjectSteps";
import FeaturedRealisations from "@/components/FeaturedRealisations";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Votre projet",
};

export default function Home() {
  return (
    <>
      <Hero />
      <SpecialtiesTeaser />
      <ProjectSteps />
      <FeaturedRealisations />
      <CtaBand />
    </>
  );
}
