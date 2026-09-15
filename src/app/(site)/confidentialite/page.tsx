import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  robots: { index: false, follow: true },
};

export default function ConfidentialitePage() {
  return (
    <div className="bg-ivory py-20 sm:py-28">
      <Container className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">RGPD</p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-navy sm:text-4xl">
          Politique de confidentialité
        </h1>
        <p className="mt-4 text-sm text-navy-mist">Dernière mise à jour : à compléter lors de la mise en ligne.</p>

        <section className="mt-10 space-y-8 text-sm leading-relaxed text-navy-mist">
          <div>
            <h2 className="font-serif text-xl text-navy">Responsable du traitement</h2>
            <p className="mt-2">
              {siteConfig.name} — {siteConfig.founder}, {siteConfig.legal.status}, est responsable
              du traitement des données collectées sur ce site. Contact :{" "}
              <a href={`mailto:${siteConfig.email}`} className="underline">
                {siteConfig.email}
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-navy">Données collectées</h2>
            <p className="mt-2">
              Le formulaire de contact du site collecte les données suivantes : nom, adresse
              email, numéro de téléphone (facultatif), type de projet et message. Ces données sont
              fournies volontairement par l&apos;utilisateur.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-navy">Finalité du traitement</h2>
            <p className="mt-2">
              Les données collectées via le formulaire de contact sont utilisées exclusivement
              pour répondre à votre demande de devis ou d&apos;information, sur la base de votre
              consentement explicite (case à cocher lors de l&apos;envoi du formulaire). Elles ne
              sont ni cédées, ni vendues, ni transmises à des tiers à des fins commerciales.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-navy">Durée de conservation</h2>
            <p className="mt-2">
              Les données transmises via le formulaire de contact sont conservées pendant une
              durée de 3 ans à compter du dernier contact, sauf obligation légale de conservation
              plus longue (par exemple en cas de relation contractuelle).
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-navy">Destinataires</h2>
            <p className="mt-2">
              Seul {siteConfig.founder} a accès aux données transmises via le formulaire de
              contact. Le site utilise des prestataires techniques (hébergement, envoi d&apos;email,
              stockage des photographies de réalisations) agissant en qualité de sous-traitants
              au sens du RGPD, dans le cadre strict de la fourniture du service.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-navy">Vos droits</h2>
            <p className="mt-2">
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi
              Informatique et Libertés, vous disposez d&apos;un droit d&apos;accès, de rectification,
              d&apos;opposition, de limitation et de suppression des données vous concernant. Vous
              pouvez exercer ces droits en écrivant à{" "}
              <a href={`mailto:${siteConfig.email}`} className="underline">
                {siteConfig.email}
              </a>
              . Vous disposez également du droit d&apos;introduire une réclamation auprès de la
              CNIL (www.cnil.fr).
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-navy">Cookies</h2>
            <p className="mt-2">
              Ce site utilise uniquement des cookies strictement nécessaires à son fonctionnement
              (par exemple, la mémorisation de votre choix concernant le bandeau cookies). Aucun
              cookie de mesure d&apos;audience ou publicitaire n&apos;est déposé sans votre
              consentement préalable.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-navy">Sécurité</h2>
            <p className="mt-2">
              Des mesures techniques et organisationnelles sont mises en œuvre pour assurer la
              sécurité et la confidentialité des données transmises via ce site (connexion
              chiffrée HTTPS, accès restreint à l&apos;espace de gestion des réalisations).
            </p>
          </div>
        </section>
      </Container>
    </div>
  );
}
