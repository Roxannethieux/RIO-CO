import Link from "next/link";
import { specialties } from "@/lib/site-config";
import { Container, Eyebrow } from "./ui";
import Reveal from "./Reveal";

export default function SpecialtiesTeaser() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <Eyebrow>Notre expertise</Eyebrow>
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

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {specialties.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.06}>
              <Link
                href={`/specialites#${s.slug}`}
                className={`group flex h-full flex-col rounded-sm border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  s.highlight
                    ? "border-gold bg-navy text-ivory"
                    : "border-navy/10 bg-ivory text-ink hover:border-gold/50"
                }`}
              >
                {s.highlight && (
                  <span className="mb-3 w-fit rounded-full border border-gold px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold">
                    Spécialité
                  </span>
                )}
                <h3
                  className={`font-serif text-lg font-semibold ${
                    s.highlight ? "text-ivory" : "text-navy"
                  }`}
                >
                  {s.title}
                </h3>
                <p
                  className={`mt-2 flex-1 text-sm leading-relaxed ${
                    s.highlight ? "text-ivory/70" : "text-navy-mist"
                  }`}
                >
                  {s.items[0]}
                </p>
                <span
                  className={`mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.1em] transition-transform group-hover:translate-x-1 ${
                    s.highlight ? "text-gold" : "text-gold-dark"
                  }`}
                >
                  En savoir plus →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
