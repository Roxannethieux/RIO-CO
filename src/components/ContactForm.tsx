"use client";

import { useState, type FormEvent } from "react";
import { siteConfig } from "@/lib/site-config";
import { Container, Eyebrow } from "./ui";
import Reveal from "./Reveal";

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Une erreur est survenue.");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Une erreur est survenue.");
    }
  }

  return (
    <section id="contact" className="bg-ivory-dim py-24 sm:py-32">
      <Container className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <Eyebrow>Contact</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-semibold text-navy sm:text-4xl">
            Prenons rendez-vous
          </h2>
          <p className="mt-6 text-base leading-relaxed text-navy-mist">
            Décrivez votre projet en quelques mots, je vous recontacte sous 24 à 48h ouvrées avec
            un premier avis et, si besoin, une date de visite.
          </p>

          <dl className="mt-10 space-y-5 text-sm">
            <div>
              <dt className="font-semibold text-navy">Téléphone</dt>
              <dd>
                <a href={siteConfig.phoneHref} className="text-navy-mist hover:text-gold-dark">
                  {siteConfig.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-navy">Email</dt>
              <dd>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-navy-mist hover:text-gold-dark"
                >
                  {siteConfig.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-navy">Zone d&apos;intervention</dt>
              <dd className="text-navy-mist">{siteConfig.address.zone}</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-sm border border-navy/10 bg-white p-8 shadow-sm"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nom complet" name="name" required autoComplete="name" />
              <Field label="Téléphone" name="phone" type="tel" autoComplete="tel" />
            </div>
            <Field label="Email" name="email" type="email" required autoComplete="email" />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor="projectType">
                Type de projet
              </label>
              <select
                id="projectType"
                name="projectType"
                className="w-full rounded-sm border border-navy/15 bg-ivory px-4 py-3 text-sm text-ink outline-none focus:border-gold"
              >
                <option value="plomberie">Plomberie / dépannage</option>
                <option value="salle-de-bain">Rénovation salle de bain</option>
                <option value="cuisine">Rénovation cuisine</option>
                <option value="renovation-complete">Rénovation complète</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor="message">
                Votre message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                className="w-full rounded-sm border border-navy/15 bg-ivory px-4 py-3 text-sm text-ink outline-none focus:border-gold"
              />
            </div>

            <label className="flex items-start gap-3 text-xs leading-relaxed text-navy-mist">
              <input type="checkbox" name="consent" required className="mt-0.5 accent-gold" />
              <span>
                J&apos;accepte que mes données soient utilisées pour traiter ma demande,
                conformément à la{" "}
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
              {status === "loading" ? "Envoi en cours…" : "Envoyer ma demande"}
            </button>

            {status === "success" && (
              <p className="text-sm font-medium text-emerald-700">
                Merci, votre message a bien été envoyé. Nous revenons vers vous rapidement.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm font-medium text-red-700">
                {errorMessage || "Une erreur est survenue, merci de réessayer."}
              </p>
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
        className="w-full rounded-sm border border-navy/15 bg-ivory px-4 py-3 text-sm text-ink outline-none focus:border-gold"
      />
    </div>
  );
}
