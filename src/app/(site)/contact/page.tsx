import type { Metadata } from "next";
import ServiceArea from "@/components/ServiceArea";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Demandez un devis gratuit à RIO & CO. — rénovation tout corps d'état et plomberie. Réponse sous 24 à 48h.",
};

export default function ContactPage() {
  return (
    <>
      <ServiceArea />
      <ContactForm />
    </>
  );
}
