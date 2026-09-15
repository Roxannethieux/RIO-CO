import type { Metadata } from "next";
import { listRealisations } from "@/lib/cloudinary";
import { groupByProject } from "@/lib/realisations";
import { Container, SectionHeading } from "@/components/ui";
import RealisationsGrid from "@/components/RealisationsGrid";

export const metadata: Metadata = {
  title: "Découvrez mon travail",
  description:
    "Découvrez mes chantiers, projet par projet, avec photos avant/après : plomberie, salles de bain, cuisines et rénovations complètes.",
};

export const revalidate = 60;

export default async function RealisationsPage() {
  const groups = groupByProject(await listRealisations());

  return (
    <div className="bg-ivory">
      <div className="bg-navy py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Portfolio complet"
            title="Découvrez mon travail"
            description="Chaque chantier reflète mon exigence : plomberie, rénovation de salles de bain, cuisines et projets complets — présentés projet par projet, avant/après quand la comparaison est disponible."
            tone="light"
          />
        </Container>
      </div>

      <div className="py-20 sm:py-24">
        <Container>
          <RealisationsGrid groups={groups} />
        </Container>
      </div>
    </div>
  );
}
