import type { Metadata } from "next";
import Hero from "@/components/Hero";
import SpecialtiesTeaser from "@/components/SpecialtiesTeaser";
import ProjectSteps from "@/components/ProjectSteps";
import FeaturedRealisations from "@/components/FeaturedRealisations";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Votre projet",
};

// Filet de sécurité en complément du revalidatePath() déclenché par le
// back-office : la page se régénère aussi automatiquement au plus tard
// 60 secondes après un ajout/modification/suppression de photo, même si
// la revalidation à la demande ne se propage pas immédiatement sur le
// CDN (mêmes 60s que /realisations).
export const revalidate = 60;

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
