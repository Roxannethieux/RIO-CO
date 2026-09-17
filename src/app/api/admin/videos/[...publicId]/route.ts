import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deleteRealisationVideo, updateRealisationVideo } from "@/lib/cloudinary";
import { realisationCategories } from "@/lib/site-config";
import { extractErrorMessage } from "@/lib/errors";

function resolvePublicId(parts: string[]) {
  const publicId = parts.join("/");
  if (!publicId.startsWith("rio-co/realisations-videos/")) return null;
  return publicId;
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ publicId: string[] }> }
) {
  const { publicId: parts } = await params;
  const publicId = resolvePublicId(parts);

  if (!publicId) {
    return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });
  }

  try {
    await deleteRealisationVideo(publicId);

    revalidatePath("/");
    revalidatePath("/realisations");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/videos] Échec suppression", error);
    return NextResponse.json({ error: "Échec de la suppression." }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ publicId: string[] }> }
) {
  const { publicId: parts } = await params;
  const publicId = resolvePublicId(parts);

  if (!publicId) {
    return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });
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
    await updateRealisationVideo(publicId, { title, description, category, project });

    revalidatePath("/");
    revalidatePath("/realisations");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/videos] Échec modification", error);
    return NextResponse.json(
      { error: extractErrorMessage(error, "Échec de la modification.") },
      { status: 500 }
    );
  }
}
