import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false, follow: true },
};

const rows: [string, string][] = [
  ["Éditeur du site", `${siteConfig.name} — ${siteConfig.founder}`],
  ["Forme juridique", siteConfig.legal.status],
  ["SIRET", siteConfig.legal.siret],
  ["RCS", siteConfig.legal.rcs],
  ["Code APE", siteConfig.legal.apeCode],
  ["Adresse", siteConfig.address.street],
  ["Email", siteConfig.email],
  ["Téléphone", siteConfig.phone],
  ["Directeur de la publication", siteConfig.legal.publicationDirector],
];

export default function MentionsLegalesPage() {
  return (
    <div className="bg-ivory py-20 sm:py-28">
      <Container className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">
          Informations légales
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-navy sm:text-4xl">
          Mentions légales
        </h1>

        <p className="mt-6 rounded-sm border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          Les informations légales ci-dessous contiennent des champs à compléter avant la mise en
          ligne définitive du site (SIRET, adresse, assurance décennale…). Elles doivent être
          vérifiées et validées par {siteConfig.founder} avant publication auprès du public.
        </p>

        <dl className="mt-10 divide-y divide-navy/10 border-y border-navy/10">
          {rows.map(([label, value]) => (
            <div key={label} className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-semibold text-navy">{label}</dt>
              <dd className="text-sm text-navy-mist sm:col-span-2">{value}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-12 space-y-8 text-sm leading-relaxed text-navy-mist">
          <div>
            <h2 className="font-serif text-xl text-navy">Hébergement</h2>
            <p className="mt-2">
              Le site est hébergé par {siteConfig.legal.host.name}, {siteConfig.legal.host.address}{" "}
              — <a href={siteConfig.legal.host.url} className="underline">
                {siteConfig.legal.host.url}
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-navy">Assurance professionnelle</h2>
            <p className="mt-2">
              {siteConfig.name} déclare être couvert par une assurance responsabilité civile
              professionnelle et une garantie décennale, conformément aux articles L241-1 et
              suivants du Code des assurances.
            </p>
            <ul className="mt-3 list-inside list-disc space-y-1">
              <li>Assureur : {siteConfig.legal.insurance.name}</li>
              <li>N° de police : {siteConfig.legal.insurance.policyNumber}</li>
              <li>Zone de couverture géographique : {siteConfig.legal.insurance.coverage}</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-xl text-navy">Médiation de la consommation</h2>
            <p className="mt-2">
              Conformément aux articles L616-1 et R616-1 du Code de la consommation, tout client
              consommateur dispose du droit de recourir gratuitement à un médiateur de la
              consommation en vue de la résolution amiable d&apos;un litige, après démarche écrite
              préalable auprès de {siteConfig.name}.
            </p>
            <p className="mt-2">
              Médiateur compétent : {siteConfig.legal.mediator.name}
              {siteConfig.legal.mediator.url ? (
                <>
                  {" "}
                  —{" "}
                  <a href={siteConfig.legal.mediator.url} className="underline">
                    {siteConfig.legal.mediator.url}
                  </a>
                </>
              ) : null}
              .
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-navy">Propriété intellectuelle</h2>
            <p className="mt-2">
              L&apos;ensemble des contenus présents sur ce site (textes, photographies des
              réalisations, identité visuelle, logo) est la propriété exclusive de{" "}
              {siteConfig.name}, sauf mention contraire. Toute reproduction, représentation ou
              adaptation, totale ou partielle, sans autorisation écrite préalable, est interdite.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-navy">Limitation de responsabilité</h2>
            <p className="mt-2">
              {siteConfig.name} s&apos;efforce d&apos;assurer l&apos;exactitude des informations
              diffusées sur ce site, sans garantir l&apos;exhaustivité ou l&apos;absence d&apos;erreur.
              Les photographies et descriptions de réalisations sont fournies à titre
              d&apos;illustration ; seul un devis signé engage contractuellement les parties.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-navy">Droit applicable</h2>
            <p className="mt-2">
              Le présent site et les présentes mentions légales sont soumis au droit français.
            </p>
          </div>
        </section>
      </Container>
    </div>
  );
}
