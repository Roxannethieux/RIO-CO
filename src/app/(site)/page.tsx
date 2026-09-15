import Hero from "@/components/Hero";
import SpecialtiesTeaser from "@/components/SpecialtiesTeaser";
import ProjectSteps from "@/components/ProjectSteps";
import FeaturedRealisations from "@/components/FeaturedRealisations";
import Testimonials from "@/components/Testimonials";
import CtaBand from "@/components/CtaBand";

export default function Home() {
  return (
    <>
      <Hero />
      <SpecialtiesTeaser />
      <ProjectSteps />
      <FeaturedRealisations />
      <Testimonials />
      <CtaBand />
    </>
  );
}
