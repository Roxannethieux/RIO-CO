import { siteConfig } from "@/lib/site-config";
import { Container, Eyebrow } from "./ui";
import Reveal from "./Reveal";

const steps = [
  { n: "01", title: "Prise de contact", text: "Nous échangeons sur votre projet, par téléphone ou via le formulaire." },
  { n: "02", title: "Visite & devis", text: "Une visite sur place pour un chiffrage précis, sans engagement." },
  { n: "03", title: "Réalisation", text: "Le chantier est mené avec un suivi régulier et une communication continue." },
  { n: "04", title: "Réception", text: "Vérification conjointe des travaux et remise des garanties applicables." },
];

export default function ServiceArea() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <Container className="grid gap-16 lg:grid-cols-2">
        <Reveal>
          <Eyebrow>Zone d&apos;intervention</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-semibold text-navy sm:text-4xl">
            Où intervient RIO &amp; CO. ?
          </h2>
          <p className="mt-6 text-base leading-relaxed text-navy-mist sm:text-lg">
            {siteConfig.founder} intervient chez les particuliers et professionnels de{" "}
            {siteConfig.address.zone}. Une distance plus importante peut être étudiée selon la
            nature du projet.
          </p>
          <div className="mt-10 flex items-center gap-4 rounded-sm border border-navy/10 bg-ivory p-6">
            <div className="h-12 w-12 shrink-0 rounded-full border border-gold/40" />
            <div>
              <div className="font-semibold text-navy">Urgence plomberie</div>
              <div className="text-sm text-navy-mist">
                Intervention rapide —{" "}
                <a href={siteConfig.phoneHref} className="font-semibold text-gold-dark">
                  {siteConfig.phone}
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid gap-6 sm:grid-cols-2">
            {steps.map((s) => (
              <div key={s.n} className="rounded-sm border border-navy/10 p-6">
                <span className="font-serif text-3xl text-gold/70">{s.n}</span>
                <h3 className="mt-2 font-semibold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-mist">{s.text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
