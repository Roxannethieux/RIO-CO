import type { Metadata } from "next";
import { listRealisations } from "@/lib/cloudinary";
import { Container, SectionHeading } from "@/components/ui";
import RealisationsGrid from "@/components/RealisationsGrid";

export const metadata: Metadata = {
  title: "Réalisations",
  description:
    "Découvrez les chantiers réalisés par RIO & CO. : plomberie, salles de bain, cuisines et rénovations complètes.",
};

export const revalidate = 60;

export default async function RealisationsPage() {
  const items = await listRealisations();

  return (
    <div className="bg-ivory">
      <div className="bg-navy py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Portfolio complet"
            title="Nos réalisations"
            description="Chaque chantier reflète notre exigence : plomberie, rénovation de salles de bain, cuisines et projets complets."
            tone="light"
          />
        </Container>
      </div>

      <div className="py-20 sm:py-24">
        <Container>
          <RealisationsGrid items={items} />
        </Container>
      </div>
    </div>
  );
}
