import { NextResponse } from "next/server";
import { deleteRealisation, updateRealisation, type PhotoRole } from "@/lib/cloudinary";
import { realisationCategories } from "@/lib/site-config";
import { extractErrorMessage } from "@/lib/errors";

const VALID_ROLES: PhotoRole[] = ["avant", "apres", "photo"];

function resolvePublicId(parts: string[]) {
  const publicId = parts.join("/");
  if (!publicId.startsWith("rio-co/realisations/")) return null;
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
    await deleteRealisation(publicId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/realisations] Échec suppression", error);
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
  const roleRaw = String(body.role || "photo").trim();

  if (!title) {
    return NextResponse.json({ error: "Le titre est requis." }, { status: 400 });
  }
  if (!project) {
    return NextResponse.json({ error: "Le nom du projet est requis." }, { status: 400 });
  }
  if (!realisationCategories.some((c) => c.value === category)) {
    return NextResponse.json({ error: "Catégorie invalide." }, { status: 400 });
  }
  if (!VALID_ROLES.includes(roleRaw as PhotoRole)) {
    return NextResponse.json({ error: "Type de photo invalide." }, { status: 400 });
  }

  try {
    await updateRealisation(publicId, {
      title,
      description,
      category,
      project,
      role: roleRaw as PhotoRole,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/realisations] Échec modification", error);
    return NextResponse.json(
      { error: extractErrorMessage(error, "Échec de la modification.") },
      { status: 500 }
    );
  }
}
