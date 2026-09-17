import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// L'upload vidéo part directement du navigateur vers Cloudinary (fichier
// trop volumineux pour repasser par notre fonction serverless) : cette
// route ne fait que rafraîchir le site public une fois l'envoi terminé,
// exactement comme les routes photo le font après une opération réussie.
export async function POST() {
  revalidatePath("/");
  revalidatePath("/realisations");
  return NextResponse.json({ ok: true });
}
