import { NextResponse } from "next/server";
import { isEmailConfigured, sendContactEmail } from "@/lib/email";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const message = String(body.message || "").trim();
  const projectType = String(body.projectType || "").trim();
  const consent = body.consent;

  if (!name || !email || !message || !consent) {
    return NextResponse.json({ error: "Merci de compléter tous les champs requis." }, { status: 400 });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
  }

  if (!isEmailConfigured()) {
    console.warn(
      `[contact] RESEND_API_KEY absente — message non envoyé. Demande de ${name} <${email}>: ${message}`
    );
    return NextResponse.json(
      {
        error:
          "L'envoi d'email n'est pas encore configuré sur ce site. Merci de contacter directement RIO & CO. par téléphone en attendant.",
      },
      { status: 503 }
    );
  }

  try {
    await sendContactEmail({ name, email, phone, message, projectType });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] Échec d'envoi", error);
    return NextResponse.json({ error: "L'envoi a échoué, merci de réessayer." }, { status: 500 });
  }
}
