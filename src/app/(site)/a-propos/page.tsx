import type { Metadata } from "next";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Maxime Rio, artisan de métier spécialisé en plomberie, fondateur de RIO & CO. — rénovation tout corps d'état.",
};

export default function AProposPage() {
  return (
    <>
      <About />
      <Testimonials />
      <CtaBand />
    </>
  );
}
