import Link from "next/link";
import { listRealisations, listRealisationVideos } from "@/lib/cloudinary";
import { attachVideos, groupByProject } from "@/lib/realisations";
import { Container, SectionHeading } from "./ui";
import RealisationsGrid from "./RealisationsGrid";

export default async function FeaturedRealisations() {
  const [photos, videos] = await Promise.all([listRealisations(), listRealisationVideos()]);
  const allGroups = attachVideos(groupByProject(photos), videos);
  const groups = allGroups.slice(0, 6);

  return (
    <section id="realisations" className="bg-ivory-dim py-24 sm:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Portfolio"
            title="Mes dernières réalisations"
            description="Un aperçu de mes chantiers — la galerie complète s'enrichit au fil des projets."
          />
          {allGroups.length > 6 && (
            <Link
              href="/realisations"
              className="shrink-0 text-sm font-semibold uppercase tracking-[0.12em] text-gold-dark hover:text-gold"
            >
              Voir tout →
            </Link>
          )}
        </div>

        <div className="mt-14">
          <RealisationsGrid groups={groups} />
        </div>
      </Container>
    </section>
  );
}
