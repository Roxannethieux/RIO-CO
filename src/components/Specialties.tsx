import { specialties } from "@/lib/site-config";
import { Container, SectionHeading } from "./ui";
import Reveal from "./Reveal";

export default function Specialties() {
  return (
    <section id="specialites" className="bg-ivory py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Nos compétences"
          title="Un artisan, tous les savoir-faire du chantier"
          description="RIO & CO. réunit les compétences nécessaires à un chantier de rénovation maîtrisé, avec la plomberie comme spécialité d'origine."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {specialties.map((spec, i) => (
            <Reveal key={spec.slug} delay={i * 0.08}>
              <div
                id={spec.slug}
                className={`group h-full scroll-mt-28 rounded-sm border p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  spec.highlight
                    ? "border-gold bg-navy text-ivory shadow-lg"
                    : "border-navy/10 bg-white text-ink hover:border-gold/50"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3
                    className={`font-serif text-2xl font-semibold ${
                      spec.highlight ? "text-ivory" : "text-navy"
                    }`}
                  >
                    {spec.title}
                  </h3>
                  {spec.highlight && (
                    <span className="rounded-full border border-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold">
                      Spécialité
                    </span>
                  )}
                </div>
                <p
                  className={`mt-3 text-sm leading-relaxed ${
                    spec.highlight ? "text-ivory/75" : "text-navy-mist"
                  }`}
                >
                  {spec.description}
                </p>
                <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                  {spec.items.map((item) => (
                    <li
                      key={item}
                      className={`flex items-center gap-2 ${
                        spec.highlight ? "text-ivory/85" : "text-ink/80"
                      }`}
                    >
                      <span
                        className="h-1 w-1 shrink-0 rounded-full"
                        style={{ background: "#B8935A" }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
