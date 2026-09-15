import type { Metadata } from "next";
import ServiceArea from "@/components/ServiceArea";
import ContactForm from "@/components/ContactForm";
import BookingForm from "@/components/BookingForm";
import { isBookingSystemConfigured } from "@/lib/bookingStatus";

export const metadata: Metadata = {
  title: "Prenons rendez-vous",
  description:
    "Prenons rendez-vous pour votre projet de rénovation — RIO & CO., tout corps d'état et plomberie. Réponse sous 24 à 48h.",
};

export default function ContactPage() {
  return (
    <>
      <ServiceArea />
      {isBookingSystemConfigured() ? <BookingForm /> : <ContactForm />}
    </>
  );
}
