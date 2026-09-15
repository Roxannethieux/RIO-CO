import { NextResponse } from "next/server";
import { withDb, isDbConfigured } from "@/lib/db";
import {
  buildTravelMatrix,
  isGoogleMapsConfigured,
  validateAddress,
  AddressNotFoundError,
  GoogleMapsServiceError,
} from "@/lib/googleMaps";
import { computeAvailableSlots, toMinutes, type ExistingAppointment } from "@/lib/booking";
import { bookingConfig } from "@/lib/site-config";

export async function GET(request: Request) {
  if (!isDbConfigured() || !isGoogleMapsConfigured()) {
    return NextResponse.json(
      { error: "La prise de rendez-vous en ligne n'est pas encore configurée.", configured: false },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") || "";
  const address = (searchParams.get("address") || "").trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Date invalide." }, { status: 400 });
  }
  if (!address) {
    return NextResponse.json({ error: "Adresse requise." }, { status: 400 });
  }
  if (bookingConfig.baseAddress.startsWith("[")) {
    return NextResponse.json(
      { error: "L'adresse de départ n'est pas encore configurée.", configured: false },
      { status: 503 }
    );
  }

  const target = new Date(`${date}T12:00:00`);
  if (!bookingConfig.workingDays.includes(target.getDay())) {
    return NextResponse.json({ slots: [] });
  }

  const now = new Date();
  const maxDate = new Date(now.getTime() + bookingConfig.maxAdvanceDays * 24 * 60 * 60 * 1000);
  if (target > maxDate) {
    return NextResponse.json({ slots: [] });
  }

  try {
    await validateAddress(address);
  } catch (error) {
    if (error instanceof AddressNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof GoogleMapsServiceError) {
      console.error("[booking/availability] Google Maps", error.message);
      return NextResponse.json(
        { error: "Le service de calcul d'itinéraire est momentanément indisponible." },
        { status: 503 }
      );
    }
    throw error;
  }

  try {
    const existing = await withDb(async (db) => {
      const result = await db.query(
        `SELECT address, start_minutes, end_minutes FROM appointments
         WHERE appointment_date = $1 AND status = 'confirmed'
         ORDER BY start_minutes ASC`,
        [date]
      );
      return result.rows as { address: string; start_minutes: number; end_minutes: number }[];
    });

    const existingAppointments: ExistingAppointment[] = existing.map((r) => ({
      address: r.address,
      startMinutes: r.start_minutes,
      endMinutes: r.end_minutes,
    }));

    const allAddresses = [bookingConfig.baseAddress, address, ...existingAppointments.map((a) => a.address)];
    const travelMinutes = await buildTravelMatrix(allAddresses);

    let slots = computeAvailableSlots({
      workingStartMinutes: toMinutes(bookingConfig.workingHours.start),
      workingEndMinutes: toMinutes(bookingConfig.workingHours.end),
      slotDurationMinutes: bookingConfig.appointmentDurationMinutes,
      slotGranularityMinutes: bookingConfig.slotGranularityMinutes,
      baseAddress: bookingConfig.baseAddress,
      newAddress: address,
      existingAppointments,
      travelMinutes,
    });

    const earliestBookable = new Date(now.getTime() + bookingConfig.minLeadHours * 60 * 60 * 1000);
    if (
      target.getFullYear() === earliestBookable.getFullYear() &&
      target.getMonth() === earliestBookable.getMonth() &&
      target.getDate() === earliestBookable.getDate()
    ) {
      const minMinutesToday = earliestBookable.getHours() * 60 + earliestBookable.getMinutes();
      slots = slots.filter((s) => toMinutes(s) >= minMinutesToday);
    } else if (target < earliestBookable) {
      slots = [];
    }

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("[booking/availability] Erreur", error);
    return NextResponse.json(
      { error: "Impossible de calculer les disponibilités pour le moment." },
      { status: 500 }
    );
  }
}
