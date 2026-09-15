import { Container, SectionHeading } from "./ui";
import Reveal from "./Reveal";

const testimonials = [
  {
    quote:
      "Intervention rapide pour une fuite en urgence, puis un devis clair pour refaire toute la salle de bain. Un travail impeccable et un vrai souci du détail.",
    author: "Client particulier",
    context: "Rénovation salle de bain",
  },
  {
    quote:
      "Maxime a coordonné l'ensemble du chantier de notre cuisine sans que nous ayons à gérer plusieurs artisans. Délais respectés, finitions parfaites.",
    author: "Client particulier",
    context: "Rénovation cuisine",
  },
  {
    quote:
      "Un professionnel sérieux, ponctuel, qui explique chaque étape. Nous recommandons sans hésiter pour tout projet de rénovation.",
    author: "Client particulier",
    context: "Rénovation complète",
  },
];

export default function Testimonials() {
  return (
    <section id="avis" className="bg-navy py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Avis clients"
          title="La confiance de nos clients, chantier après chantier"
          tone="light"
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.author + i} delay={i * 0.1}>
              <blockquote className="flex h-full flex-col rounded-sm border border-gold/20 bg-white/[0.03] p-8">
                <span className="font-serif text-4xl leading-none text-gold">&ldquo;</span>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ivory/85">{t.quote}</p>
                <footer className="mt-6 border-t border-white/10 pt-4">
                  <div className="text-sm font-semibold text-ivory">{t.author}</div>
                  <div className="text-xs uppercase tracking-wide text-ivory/50">{t.context}</div>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-ivory/40">
          Témoignages présentés à titre d&apos;exemple — à remplacer par les avis réels des clients de RIO &amp; CO.
        </p>
      </Container>
    </section>
  );
}
