// Configuration centrale du site — à ajuster avec les informations réelles
// de l'entreprise avant mise en ligne définitive chez le client.

export const siteConfig = {
  name: "RIO & CO.",
  legalName: "[RAISON SOCIALE À COMPLÉTER]",
  tagline: "Rénovation tout corps d'état & plomberie",
  founder: "Maxime Rio",
  founderRole: "Fondateur & artisan",
  baseUrl: "https://rio-co.vercel.app",
  phone: "[Téléphone]",
  phoneHref: "tel:+33000000000",
  email: "contact@rio-co.fr",
  address: {
    street: "[ADRESSE À COMPLÉTER]",
    zone: "[ZONE D'INTERVENTION À COMPLÉTER — ex. Île-de-France]",
  },
  social: {
    instagram: "",
    facebook: "",
  },
  legal: {
    status: "[FORME JURIDIQUE — ex. Entrepreneur Individuel / SASU]",
    siret: "[N° SIRET À COMPLÉTER]",
    rcs: "[VILLE RCS À COMPLÉTER]",
    capital: "[CAPITAL SOCIAL — si société]",
    apeCode: "[CODE APE À COMPLÉTER]",
    insurance: {
      name: "[ASSUREUR DÉCENNALE À COMPLÉTER]",
      policyNumber: "[N° POLICE À COMPLÉTER]",
      coverage: "[ZONE DE COUVERTURE GÉOGRAPHIQUE À COMPLÉTER]",
    },
    mediator: {
      name: "[MÉDIATEUR DE LA CONSOMMATION À COMPLÉTER]",
      url: "",
    },
    host: {
      name: "Vercel Inc.",
      address: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
      url: "https://vercel.com",
    },
    publicationDirector: "Maxime Rio",
  },
} as const;

export const navLinks = [
  { href: "/#specialites", label: "Spécialités" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/#a-propos", label: "À propos" },
  { href: "/#avis", label: "Avis clients" },
  { href: "/#contact", label: "Contact" },
] as const;

export const specialties = [
  {
    slug: "plombier",
    title: "Plomberie",
    highlight: true,
    description:
      "Installation, dépannage et rénovation de plomberie — de la fuite d'urgence à la refonte complète de vos réseaux d'eau, notre spécialité historique.",
    items: [
      "Recherche de fuite & dépannage",
      "Installation sanitaire complète",
      "Rénovation salle de bain",
      "Chauffe-eau & production d'eau chaude",
    ],
  },
  {
    slug: "renovation-complete",
    title: "Rénovation complète",
    highlight: false,
    description:
      "Un seul interlocuteur pour l'ensemble de votre chantier, du gros œuvre aux finitions, coordonné de bout en bout.",
    items: ["Cuisine", "Salle de bain", "Extension & combles", "Rénovation énergétique"],
  },
  {
    slug: "second-oeuvre",
    title: "Second œuvre",
    highlight: false,
    description:
      "Cloisons, électricité, menuiserie, peinture : toutes les compétences pour finaliser votre projet avec exigence.",
    items: ["Électricité", "Placo & cloisons", "Menuiserie", "Peinture & revêtements"],
  },
  {
    slug: "carrelage-sols",
    title: "Sols & carrelage",
    highlight: false,
    description:
      "Pose de carrelage, parquet et revêtements de sol, avec un soin particulier apporté aux finitions.",
    items: ["Carrelage", "Parquet", "Chape & ragréage", "Faïence"],
  },
] as const;

export const realisationCategories = [
  { value: "plomberie", label: "Plomberie" },
  { value: "salle-de-bain", label: "Salle de bain" },
  { value: "cuisine", label: "Cuisine" },
  { value: "renovation-complete", label: "Rénovation complète" },
  { value: "exterieur", label: "Extérieur" },
  { value: "autre", label: "Autre" },
] as const;

export type RealisationCategory = (typeof realisationCategories)[number]["value"];
