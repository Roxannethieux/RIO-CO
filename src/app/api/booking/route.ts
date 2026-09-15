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
import { bookingConfig, siteConfig } from "@/lib/site-config";
import { isEmailConfigured, sendBookingEmails } from "@/lib/email";

export async function POST(request: Request) {
  if (!isDbConfigured() || !isGoogleMapsConfigured() || bookingConfig.baseAddress.startsWith("[")) {
    return NextResponse.json(
      { error: "La prise de rendez-vous en ligne n'est pas encore configurée." },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const email = String(body.email || "").trim();
  const address = String(body.address || "").trim();
  const projectType = String(body.projectType || "").trim();
  const notes = String(body.notes || "").trim();
  const date = String(body.date || "").trim();
  const time = String(body.time || "").trim();
  const consent = body.consent;

  if (!name || !phone || !email || !address || !date || !time || !consent) {
    return NextResponse.json({ error: "Merci de compléter tous les champs requis." }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
    return NextResponse.json({ error: "Date ou heure invalide." }, { status: 400 });
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
  }

  try {
    await validateAddress(address);
  } catch (error) {
    if (error instanceof AddressNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof GoogleMapsServiceError) {
      console.error("[booking] Google Maps", error.message);
      return NextResponse.json(
        { error: "Le service de calcul d'itinéraire est momentanément indisponible." },
        { status: 503 }
      );
    }
    throw error;
  }

  const startMinutes = toMinutes(time);
  const endMinutes = startMinutes + bookingConfig.appointmentDurationMinutes;

  try {
    const result = await withDb(async (db) => {
      // Re-vérification du créneau au moment de la validation, pour éviter
      // qu'un même créneau soit réservé deux fois entre l'affichage et l'envoi.
      const existingRows = await db.query(
        `SELECT address, start_minutes, end_minutes FROM appointments
         WHERE appointment_date = $1 AND status = 'confirmed'
         ORDER BY start_minutes ASC`,
        [date]
      );
      const existingAppointments: ExistingAppointment[] = existingRows.rows.map(
        (r: { address: string; start_minutes: number; end_minutes: number }) => ({
          address: r.address,
          startMinutes: r.start_minutes,
          endMinutes: r.end_minutes,
        })
      );

      const allAddresses = [bookingConfig.baseAddress, address, ...existingAppointments.map((a) => a.address)];
      const travelMinutes = await buildTravelMatrix(allAddresses);

      const availableSlots = computeAvailableSlots({
        workingStartMinutes: toMinutes(bookingConfig.workingHours.start),
        workingEndMinutes: toMinutes(bookingConfig.workingHours.end),
        slotDurationMinutes: bookingConfig.appointmentDurationMinutes,
        slotGranularityMinutes: bookingConfig.slotGranularityMinutes,
        baseAddress: bookingConfig.baseAddress,
        newAddress: address,
        existingAppointments,
        travelMinutes,
      });

      if (!availableSlots.includes(time)) {
        throw new SlotUnavailableError();
      }

      const insertResult = await db.query(
        `INSERT INTO appointments
          (name, phone, email, address, project_type, notes, appointment_date, start_minutes, end_minutes, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'confirmed')
         RETURNING id`,
        [name, phone, email, address, projectType, notes, date, startMinutes, endMinutes]
      );
      return insertResult.rows[0].id as number;
    });

    if (isEmailConfigured()) {
      try {
        await sendBookingEmails({
          name,
          phone,
          email,
          address,
          projectType,
          notes,
          date,
          time,
        });
      } catch (emailError) {
        console.error("[booking] Échec d'envoi des emails de confirmation", emailError);
      }
    }

    return NextResponse.json({ ok: true, id: result, founder: siteConfig.founder });
  } catch (error) {
    if (error instanceof SlotUnavailableError) {
      return NextResponse.json(
        { error: "Ce créneau vient d'être réservé, merci d'en choisir un autre." },
        { status: 409 }
      );
    }
    console.error("[booking] Erreur", error);
    return NextResponse.json({ error: "La réservation a échoué, merci de réessayer." }, { status: 500 });
  }
}

class SlotUnavailableError extends Error {}
