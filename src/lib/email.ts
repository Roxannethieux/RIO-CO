import { Resend } from "resend";
import { siteConfig } from "@/lib/site-config";

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

function formatDateFr(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
  projectType: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY n'est pas configurée.");
  }

  const resend = new Resend(apiKey);
  const to = process.env.CONTACT_TO_EMAIL || siteConfig.email;

  await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL || "RIO & CO. <onboarding@resend.dev>",
    to,
    replyTo: data.email,
    subject: `Nouvelle demande de devis — ${data.name}`,
    text: [
      `Nom : ${data.name}`,
      `Email : ${data.email}`,
      `Téléphone : ${data.phone || "non renseigné"}`,
      `Type de projet : ${data.projectType || "non précisé"}`,
      "",
      "Message :",
      data.message,
    ].join("\n"),
  });
}

export async function sendBookingEmails(data: {
  name: string;
  phone: string;
  email: string;
  address: string;
  projectType: string;
  notes: string;
  date: string;
  time: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY n'est pas configurée.");
  }

  const resend = new Resend(apiKey);
  const from = process.env.CONTACT_FROM_EMAIL || "RIO & CO. <onboarding@resend.dev>";
  const to = process.env.CONTACT_TO_EMAIL || siteConfig.email;
  const dateLabel = formatDateFr(data.date);

  await resend.emails.send({
    from,
    to,
    replyTo: data.email,
    subject: `Nouveau rendez-vous — ${data.name} le ${dateLabel} à ${data.time}`,
    text: [
      `Nouveau rendez-vous confirmé automatiquement :`,
      "",
      `Date : ${dateLabel} à ${data.time}`,
      `Client : ${data.name}`,
      `Téléphone : ${data.phone}`,
      `Email : ${data.email}`,
      `Adresse du chantier : ${data.address}`,
      `Type de projet : ${data.projectType || "non précisé"}`,
      "",
      "Notes :",
      data.notes || "(aucune)",
    ].join("\n"),
  });

  await resend.emails.send({
    from,
    to: data.email,
    subject: `Votre rendez-vous avec ${siteConfig.founder} — ${dateLabel} à ${data.time}`,
    text: [
      `Bonjour ${data.name},`,
      "",
      `Votre rendez-vous est confirmé pour le ${dateLabel} à ${data.time}, à l'adresse indiquée : ${data.address}.`,
      "",
      `Pour toute question ou si vous devez modifier ce rendez-vous, contactez-moi directement au ${siteConfig.phone}.`,
      "",
      `À bientôt,`,
      siteConfig.founder,
    ].join("\n"),
  });
}
