"use client";

import { useEffect, useState } from "react";
import { toHHMM } from "@/lib/booking";

type Appointment = {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  project_type: string;
  notes: string;
  appointment_date: string;
  start_minutes: number;
  end_minutes: number;
};

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      const res = await fetch("/api/admin/appointments");
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Échec du chargement.");
      setAppointments(body.appointments);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec du chargement.");
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- chargement initial des rendez-vous
    load();
  }, []);

  async function cancel(id: number) {
    if (!confirm("Annuler ce rendez-vous ?")) return;
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Échec de l'annulation.");
      }
      setAppointments((prev) => prev?.filter((a) => a.id !== id) ?? null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Échec de l'annulation.");
    }
  }

  if (error) {
    return <p className="rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>;
  }

  if (!appointments) {
    return <p className="text-sm text-navy-mist">Chargement…</p>;
  }

  if (appointments.length === 0) {
    return (
      <p className="rounded-sm border border-dashed border-navy/20 bg-white px-6 py-10 text-center text-sm text-navy-mist">
        Aucun rendez-vous à venir.
      </p>
    );
  }

  const byDate = appointments.reduce<Record<string, Appointment[]>>((acc, a) => {
    (acc[a.appointment_date] ??= []).push(a);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(byDate).map(([date, items]) => (
        <div key={date}>
          <h3 className="mb-3 font-serif text-lg text-navy">
            {new Date(`${date}T12:00:00`).toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </h3>
          <div className="space-y-3">
            {items.map((a) => (
              <div
                key={a.id}
                className="flex flex-col gap-3 rounded-sm border border-navy/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="text-sm font-semibold text-navy">
                    {toHHMM(a.start_minutes)} – {toHHMM(a.end_minutes)} · {a.name}
                  </div>
                  <div className="mt-1 text-xs text-navy-mist">{a.address}</div>
                  <div className="mt-1 text-xs text-navy-mist">
                    {a.phone} · {a.email}
                    {a.project_type ? ` · ${a.project_type}` : ""}
                  </div>
                  {a.notes && <div className="mt-1 text-xs italic text-navy-mist">{a.notes}</div>}
                </div>
                <button
                  type="button"
                  onClick={() => cancel(a.id)}
                  className="shrink-0 rounded-sm border border-red-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-600 hover:bg-red-50"
                >
                  Annuler
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
