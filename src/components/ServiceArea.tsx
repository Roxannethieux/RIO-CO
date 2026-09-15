import { siteConfig } from "@/lib/site-config";
import { Container, Eyebrow } from "./ui";
import Reveal from "./Reveal";

export default function ServiceArea() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <Container className="max-w-2xl">
        <Reveal>
          <Eyebrow>Zone d&apos;intervention</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-semibold text-navy sm:text-4xl">
            Où intervient RIO &amp; CO. ?
          </h2>
          <p className="mt-6 text-base leading-relaxed text-navy-mist sm:text-lg">
            J&apos;interviens chez les particuliers et professionnels de{" "}
            {siteConfig.address.zone}. Une distance plus importante peut être étudiée selon la
            nature du projet.
          </p>
          <div className="mt-10 flex items-center gap-4 rounded-sm border border-navy/10 bg-ivory p-6">
            <div className="h-12 w-12 shrink-0 rounded-full border border-gold/40" />
            <div>
              <div className="font-semibold text-navy">Un projet à discuter ?</div>
              <div className="text-sm text-navy-mist">
                Appelez-moi directement —{" "}
                <a href={siteConfig.phoneHref} className="font-semibold text-gold-dark">
                  {siteConfig.phone}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
