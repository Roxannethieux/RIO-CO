import { siteConfig } from "@/lib/site-config";
import { Container, Eyebrow } from "./ui";
import Reveal from "./Reveal";

const commitments = [
  {
    title: "Devis clair, sans surprise",
    text: "Chaque intervention est chiffrée en détail avant démarrage — le prix annoncé est le prix facturé.",
  },
  {
    title: "Un seul interlocuteur",
    text: "Maxime Rio suit personnellement chaque chantier, de la première visite à la réception des travaux.",
  },
  {
    title: "Finitions soignées",
    text: "Le respect du délai ne se fait jamais au détriment de la qualité d'exécution.",
  },
];

export default function About() {
  return (
    <section id="a-propos" className="relative overflow-hidden bg-white py-24 sm:py-32">
      <Container className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div className="relative">
            <div className="aspect-[4/5] w-full overflow-hidden rounded-sm bg-navy">
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy via-navy-light to-navy-deep">
                <span className="px-8 text-center font-serif text-lg text-ivory/60">
                  Portrait de {siteConfig.founder}
                  <br />
                  <span className="text-sm text-ivory/40">(photo à intégrer)</span>
                </span>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 hidden rounded-sm border border-gold/40 bg-ivory px-7 py-5 shadow-xl sm:block">
              <div className="font-serif text-3xl text-navy">10+</div>
              <div className="text-xs uppercase tracking-wide text-navy-mist">
                années de métier
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Eyebrow>À propos</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-semibold text-navy text-balance sm:text-4xl">
            {siteConfig.founder}, artisan de métier, chef de chantier de confiance
          </h2>
          <p className="mt-6 text-base leading-relaxed text-navy-mist sm:text-lg">
            Formé à la plomberie, {siteConfig.founder} a élargi son savoir-faire à l&apos;ensemble
            des corps de métier du bâtiment pour offrir à ses clients un accompagnement complet et
            sans rupture. RIO &amp; CO. est né de cette conviction : un chantier de rénovation se
            réussit avec un interlocuteur unique, exigeant sur le détail et transparent sur chaque
            étape.
          </p>

          <div className="mt-10 space-y-6">
            {commitments.map((c) => (
              <div key={c.title} className="flex gap-4">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" />
                <div>
                  <h3 className="font-semibold text-navy">{c.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-navy-mist">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
