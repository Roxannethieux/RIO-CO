import { NextResponse } from "next/server";
import { deleteRealisation } from "@/lib/cloudinary";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ publicId: string[] }> }
) {
  const { publicId: parts } = await params;
  const publicId = parts.join("/");

  if (!publicId.startsWith("rio-co/realisations/")) {
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
