import Link from "next/link";
import { specialties } from "@/lib/site-config";
import { Container, Eyebrow } from "./ui";

export default function SpecialtiesTeaser() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <Eyebrow>Nos compétences</Eyebrow>
            <h2 className="mt-4 font-serif text-3xl font-semibold text-navy sm:text-4xl">
              Tous les savoir-faire du chantier
            </h2>
          </div>
          <Link
            href="/specialites"
            className="shrink-0 text-sm font-semibold uppercase tracking-[0.12em] text-gold-dark hover:text-gold"
          >
            Voir le détail →
          </Link>
        </div>

        <ul className="mt-10 flex flex-wrap gap-3">
          {specialties.map((s) => (
            <li key={s.slug}>
              <Link
                href="/specialites"
                className={`inline-flex items-center rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
                  s.highlight
                    ? "border-gold bg-navy text-ivory"
                    : "border-navy/15 text-navy hover:border-gold hover:text-gold-dark"
                }`}
              >
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
