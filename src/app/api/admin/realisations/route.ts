import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { uploadRealisation, type PhotoRole } from "@/lib/cloudinary";
import { realisationCategories } from "@/lib/site-config";
import { extractErrorMessage } from "@/lib/errors";

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 Mo
const VALID_ROLES: PhotoRole[] = ["avant", "apres", "photo"];

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const project = String(formData.get("project") || "").trim();
  const roleRaw = String(formData.get("role") || "photo").trim();

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucune image fournie." }, { status: 400 });
  }
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
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Le fichier doit être une image." }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Image trop volumineuse (8 Mo maximum)." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await uploadRealisation({
      fileDataUrl: base64,
      title,
      description,
      category,
      project,
      role: roleRaw as PhotoRole,
    });

    revalidatePath("/");
    revalidatePath("/realisations");

    return NextResponse.json({ ok: true, publicId: result.public_id });
  } catch (error) {
    console.error("[admin/realisations] Échec upload", error);
    return NextResponse.json(
      { error: extractErrorMessage(error, "Échec de l'envoi de l'image.") },
      { status: 500 }
    );
  }
}
