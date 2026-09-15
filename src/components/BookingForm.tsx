"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Container, Eyebrow } from "./ui";
import Reveal from "./Reveal";

type Status = "idle" | "loading" | "success" | "error";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function maxDateIso(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function BookingForm() {
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState("");

  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const maxDate = useMemo(() => maxDateIso(45), []);

  useEffect(() => {
    if (!address.trim() || !date) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronise l'état local avec les champs adresse/date
      setSlots([]);
      setSelectedSlot(null);
      return;
    }

    let cancelled = false;
    setSlotsLoading(true);
    setSlotsError("");
    setSelectedSlot(null);

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/booking/availability?date=${date}&address=${encodeURIComponent(address)}`
        );
        const body = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setSlotsError(body.error || "Impossible de calculer les disponibilités.");
          setSlots([]);
        } else {
          setSlots(body.slots || []);
        }
      } catch {
        if (!cancelled) setSlotsError("Impossible de calculer les disponibilités.");
      } finally {
        if (!cancelled) setSlotsLoading(false);
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [address, date]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedSlot) return;
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, address, date, time: selectedSlot }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Une erreur est survenue.");
      setStatus("success");
      form.reset();
      setAddress("");
      setDate("");
      setSelectedSlot(null);
      setSlots([]);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Une erreur est survenue.");
    }
  }

  if (status === "success") {
    return (
      <section className="bg-ivory-dim py-24 sm:py-32">
        <Container className="max-w-xl text-center">
          <Eyebrow>Rendez-vous confirmé</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-semibold text-navy">
            C&apos;est noté !
          </h2>
          <p className="mt-4 text-base leading-relaxed text-navy-mist">
            Votre rendez-vous est confirmé. Vous allez recevoir un email de confirmation avec
            tous les détails.
          </p>
        </Container>
      </section>
    );
  }

  return (
    <section id="contact" className="bg-ivory-dim py-24 sm:py-32">
      <Container className="max-w-2xl">
        <Reveal>
          <Eyebrow>Prenons rendez-vous</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-semibold text-navy sm:text-4xl">
            Réservez un créneau
          </h2>
          <p className="mt-4 text-base leading-relaxed text-navy-mist">
            Indiquez l&apos;adresse du chantier et une date : je vous propose les créneaux
            réellement disponibles, en tenant compte de mes trajets ce jour-là.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-navy">
                  Adresse du chantier *
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex. 12 rue de la Paix, 75002 Paris"
                  className="w-full rounded-sm border border-navy/15 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-gold"
                />
              </div>
              <div>
                <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-navy">
                  Date souhaitée *
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  required
                  min={todayIso()}
                  max={maxDate}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-sm border border-navy/15 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-gold"
                />
              </div>
            </div>

            {address.trim() && date && (
              <div>
                <p className="mb-2 text-sm font-medium text-navy">Créneaux disponibles</p>
                {slotsLoading && <p className="text-sm text-navy-mist">Calcul en cours…</p>}
                {slotsError && <p className="text-sm text-red-600">{slotsError}</p>}
                {!slotsLoading && !slotsError && slots.length === 0 && (
                  <p className="text-sm text-navy-mist">
                    Aucun créneau disponible ce jour-là — essayez une autre date.
                  </p>
                )}
                {slots.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {slots.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSlot(s)}
                        className={`rounded-sm border px-4 py-2 text-sm font-semibold transition-colors ${
                          selectedSlot === s
                            ? "border-gold bg-gold text-navy-deep"
                            : "border-navy/15 text-navy hover:border-gold hover:text-gold-dark"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedSlot && (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Nom complet" name="name" required autoComplete="name" />
                  <Field label="Téléphone" name="phone" type="tel" required autoComplete="tel" />
                </div>
                <Field label="Email" name="email" type="email" required autoComplete="email" />
                <div>
                  <label htmlFor="projectType" className="mb-1.5 block text-sm font-medium text-navy">
                    Type de projet
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    className="w-full rounded-sm border border-navy/15 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-gold"
                  >
                    <option value="plomberie">Plomberie</option>
                    <option value="salle-de-bain">Rénovation salle de bain</option>
                    <option value="cuisine">Rénovation cuisine</option>
                    <option value="renovation-complete">Rénovation complète</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-navy">
                    Précisions sur votre projet (optionnel)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    className="w-full rounded-sm border border-navy/15 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-gold"
                  />
                </div>

                <label className="flex items-start gap-3 text-xs leading-relaxed text-navy-mist">
                  <input type="checkbox" name="consent" required className="mt-0.5 accent-gold" />
                  <span>
                    J&apos;accepte que mes données soient utilisées pour confirmer ce
                    rendez-vous, conformément à la{" "}
                    <a href="/confidentialite" className="underline decoration-gold underline-offset-2">
                      politique de confidentialité
                    </a>
                    .
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full rounded-sm bg-navy px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-ivory transition-colors hover:bg-navy-light disabled:opacity-60"
                >
                  {status === "loading"
                    ? "Confirmation en cours…"
                    : `Confirmer le rendez-vous du ${date} à ${selectedSlot}`}
                </button>

                {status === "error" && (
                  <p className="text-sm font-medium text-red-700">{errorMessage}</p>
                )}
              </>
            )}
          </form>
        </Reveal>
      </Container>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor={name}>
        {label}
        {required && " *"}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-sm border border-navy/15 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-gold"
      />
    </div>
  );
}
