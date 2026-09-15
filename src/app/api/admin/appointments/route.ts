import { NextResponse } from "next/server";
import { withDb, isDbConfigured } from "@/lib/db";

export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json({ appointments: [] });
  }

  try {
    const appointments = await withDb(async (db) => {
      const result = await db.query(
        `SELECT id, name, phone, email, address, project_type, notes,
                appointment_date, start_minutes, end_minutes, status, created_at
         FROM appointments
         WHERE appointment_date >= CURRENT_DATE AND status = 'confirmed'
         ORDER BY appointment_date ASC, start_minutes ASC`
      );
      return result.rows;
    });
    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("[admin/appointments] Erreur", error);
    return NextResponse.json({ error: "Impossible de charger les rendez-vous." }, { status: 500 });
  }
}
