import type { Metadata } from "next";
import Specialties from "@/components/Specialties";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Nos spécialités",
  description:
    "Plomberie, rénovation complète, second œuvre, sols et carrelage — les savoir-faire de RIO & CO., artisan tout corps d'état.",
};

export default function SpecialitesPage() {
  return (
    <>
      <Specialties />
      <CtaBand />
    </>
  );
}
