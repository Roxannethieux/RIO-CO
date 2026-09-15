import { Container, GoldButton } from "./ui";
import { siteConfig } from "@/lib/site-config";

export default function CtaBand() {
  return (
    <section className="bg-navy-deep py-16">
      <Container className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-serif text-2xl text-ivory sm:text-3xl">
            Un projet à chiffrer ?
          </p>
          <p className="mt-1 text-sm text-ivory/60">
            Devis gratuit — réponse sous 24 à 48h ouvrées.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <GoldButton href="/contact">Demander un devis</GoldButton>
          <a
            href={siteConfig.phoneHref}
            className="text-sm font-semibold text-ivory/80 hover:text-gold"
          >
            {siteConfig.phone}
          </a>
        </div>
      </Container>
    </section>
  );
}
