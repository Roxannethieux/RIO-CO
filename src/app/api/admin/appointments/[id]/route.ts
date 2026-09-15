import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) {
    return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });
  }

  try {
    await withDb((db) =>
      db.query(`UPDATE appointments SET status = 'cancelled' WHERE id = $1`, [numericId])
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/appointments] Échec annulation", error);
    return NextResponse.json({ error: "Échec de l'annulation." }, { status: 500 });
  }
}
