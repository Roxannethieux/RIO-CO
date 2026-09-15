"use client";

import { useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "rio-co-cookie-consent";

function subscribe() {
  return () => {};
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return "unavailable";
  }
}

function getServerSnapshot() {
  return "pending";
}

export default function CookieConsent() {
  const [dismissed, setDismissed] = useState(false);
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const visible = !dismissed && stored === null;

  const choose = (value: "accepted" | "refused") => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // stockage indisponible : on masque simplement le bandeau pour la session
    }
    setDismissed(true);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Gestion des cookies"
      className="fixed inset-x-0 bottom-0 z-[90] border-t border-gold/30 bg-navy-deep/98 px-5 py-5 text-ivory shadow-[0_-8px_30px_rgba(0,0,0,0.25)] backdrop-blur sm:px-8"
    >
      <div className="container-xl flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm leading-relaxed text-ivory/80">
          Ce site utilise uniquement des cookies strictement nécessaires à son fonctionnement.
          Aucun cookie publicitaire ou de mesure d&apos;audience tiers n&apos;est déposé sans votre
          consentement. Consultez notre{" "}
          <a href="/confidentialite" className="underline decoration-gold underline-offset-4">
            politique de confidentialité
          </a>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => choose("refused")}
            className="rounded-sm border border-ivory/30 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-ivory/80 hover:border-ivory"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="rounded-sm bg-gold px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-navy-deep hover:bg-gold-light"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
