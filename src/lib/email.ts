import { Resend } from "resend";
import { siteConfig } from "@/lib/site-config";

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
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
