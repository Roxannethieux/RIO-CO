import { NextResponse } from "next/server";
import { isCloudinaryConfigured, signVideoUpload } from "@/lib/cloudinary";
import { realisationCategories } from "@/lib/site-config";
import { extractErrorMessage } from "@/lib/errors";

export async function POST(request: Request) {
  if (!isCloudinaryConfigured()) {
    return NextResponse.json({ error: "Cloudinary n'est pas configuré." }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }

  const title = String(body.title || "").trim();
  const description = String(body.description || "").trim();
  const category = String(body.category || "").trim();
  const project = String(body.project || "").trim();

  if (!title) {
    return NextResponse.json({ error: "Le titre est requis." }, { status: 400 });
  }
  if (!project) {
    return NextResponse.json({ error: "Le nom du projet est requis." }, { status: 400 });
  }
  if (!realisationCategories.some((c) => c.value === category)) {
    return NextResponse.json({ error: "Catégorie invalide." }, { status: 400 });
  }

  try {
    const signed = signVideoUpload({ title, description, category, project });
    return NextResponse.json(signed);
  } catch (error) {
    console.error("[admin/videos] Échec signature", error);
    return NextResponse.json(
      { error: extractErrorMessage(error, "Échec de la préparation de l'envoi.") },
      { status: 500 }
    );
  }
}
