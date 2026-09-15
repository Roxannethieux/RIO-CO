import Link from "next/link";
import { listRealisations } from "@/lib/cloudinary";
import { Container, SectionHeading } from "./ui";
import RealisationsGrid from "./RealisationsGrid";

export default async function FeaturedRealisations() {
  const all = await listRealisations();
  const items = all.slice(0, 6);

  return (
    <section id="realisations" className="bg-ivory-dim py-24 sm:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Portfolio"
            title="Nos dernières réalisations"
            description="Un aperçu des chantiers menés par Maxime Rio — la galerie complète s'enrichit au fil des projets."
          />
          {all.length > 6 && (
            <Link
              href="/realisations"
              className="shrink-0 text-sm font-semibold uppercase tracking-[0.12em] text-gold-dark hover:text-gold"
            >
              Voir tout →
            </Link>
          )}
        </div>

        <div className="mt-14">
          <RealisationsGrid items={items} />
        </div>
      </Container>
    </section>
  );
}
