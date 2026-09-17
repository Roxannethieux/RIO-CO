"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { ProjectGroup } from "@/lib/realisations";
import { realisationCategories } from "@/lib/site-config";
import BeforeAfterSlider from "./BeforeAfterSlider";
import RoleBadge from "./RoleBadge";

export default function Lightbox({
  groups,
  index,
  onClose,
  onNavigate,
}: {
  groups: ProjectGroup[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const group = groups[index];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % groups.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + groups.length) % groups.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, groups.length, onClose, onNavigate]);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  if (!group) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={group.projectName}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-deep/96 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-ivory/30 text-lg text-ivory transition-colors hover:border-gold hover:text-gold sm:right-6 sm:top-6"
      >
        ✕
      </button>

      {groups.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index - 1 + groups.length) % groups.length);
            }}
            aria-label="Projet précédent"
            className="absolute left-2 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/30 text-xl text-ivory transition-colors hover:border-gold hover:text-gold sm:flex sm:left-4"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index + 1) % groups.length);
            }}
            aria-label="Projet suivant"
            className="absolute right-2 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/30 text-xl text-ivory transition-colors hover:border-gold hover:text-gold sm:flex sm:right-4"
          >
            ›
          </button>
        </>
      )}

      {/* keyed by group.key : remonte le contenu (et son état local) à chaque changement de projet */}
      <LightboxContent key={group.key} group={group} />
    </div>
  );
}

function LightboxContent({ group }: { group: ProjectGroup }) {
  const [activeExtra, setActiveExtra] = useState<number | null>(null);
  const hasPair = group.pairs.length > 0;
  const showingExtra = activeExtra !== null && group.photos[activeExtra];

  return (
    <div
      className="max-h-full w-full max-w-3xl overflow-y-auto rounded-sm bg-navy"
      onClick={(e) => e.stopPropagation()}
    >
      {showingExtra ? (
        <div className="relative aspect-[4/3] w-full bg-navy-deep">
          <Image
            src={group.photos[activeExtra as number].url}
            alt={group.photos[activeExtra as number].title}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-contain"
            priority
          />
          <RoleBadge role={group.photos[activeExtra as number].role} side="left" />
        </div>
      ) : hasPair ? (
        <BeforeAfterSlider before={group.pairs[0].before} after={group.pairs[0].after} priority />
      ) : group.photos[0] ? (
        <div className="relative aspect-[4/3] w-full bg-navy-deep">
          <Image
            src={group.photos[0].url}
            alt={group.photos[0].title}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-contain"
            priority
          />
          <RoleBadge role={group.photos[0].role} side="left" />
        </div>
      ) : null}

      {group.photos.length > (hasPair ? 0 : 1) && (
        <div className="flex gap-2 overflow-x-auto p-4">
          {hasPair && (
            <button
              type="button"
              onClick={() => setActiveExtra(null)}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-sm border-2 ${
                activeExtra === null ? "border-gold" : "border-transparent"
              }`}
            >
              <Image
                src={group.pairs[0].after.url}
                alt="Avant / après"
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          )}
          {group.photos.map((p, i) => (
            <button
              key={p.publicId}
              type="button"
              onClick={() => setActiveExtra(i)}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-sm border-2 ${
                activeExtra === i ? "border-gold" : "border-transparent"
              }`}
            >
              <Image src={p.url} alt={p.title} fill sizes="80px" className="object-cover" />
              <RoleBadge role={p.role} side="left" size="sm" />
            </button>
          ))}
        </div>
      )}

      <div className="p-6 pt-2">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-gold">
          {realisationCategories.find((c) => c.value === group.category)?.label ?? "Réalisation"}
        </span>
        <h3 className="mt-1 font-serif text-xl text-ivory">{group.projectName}</h3>
        {group.description && (
          <p className="mt-2 text-sm leading-relaxed text-ivory/70">{group.description}</p>
        )}
      </div>
    </div>
  );
}
