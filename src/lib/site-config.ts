// Configuration centrale du site — à ajuster avec les informations réelles
// de l'entreprise avant mise en ligne définitive chez le client.

export const bookingConfig = {
  // Adresse de départ / retour de la journée (atelier, domicile professionnel...).
  // Indispensable pour calculer le premier et le dernier trajet de la journée.
  baseAddress: "[ADRESSE DE DÉPART À COMPLÉTER — ex. atelier ou domicile professionnel]",
  workingDays: [1, 2, 3, 4, 5] as number[], // 0 = dimanche … 6 = samedi
  workingHours: { start: "08:00", end: "18:00" },
  appointmentDurationMinutes: 60,
  slotGranularityMinutes: 30,
  minLeadHours: 24,
  maxAdvanceDays: 45,
} as const;

export const siteConfig = {
  name: "RIO & CO.",
  legalName: "[RAISON SOCIALE À COMPLÉTER]",
  tagline: "Rénovation tout corps d'état & plomberie",
  founder: "Maxime Rio",
  founderRole: "Fondateur & artisan",
  baseUrl: "https://rio-co.vercel.app",
  phone: "06 20 43 79 16",
  phoneHref: "tel:+33620437916",
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
  { href: "/", label: "Votre projet" },
  { href: "/specialites", label: "Mes spécialités" },
  { href: "/realisations", label: "Découvrez mon travail" },
  { href: "/contact", label: "Prenons rendez-vous" },
] as const;

export const specialties = [
  {
    slug: "plombier",
    title: "Plomberie",
    highlight: true,
    description:
      "Installation et rénovation complète de vos réseaux d'eau et sanitaires, de la conception à la finition — ma spécialité historique.",
    items: [
      "Rénovation de réseaux d'eau",
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
