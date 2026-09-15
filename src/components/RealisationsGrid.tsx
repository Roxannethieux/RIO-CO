"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Realisation } from "@/lib/cloudinary";
import { realisationCategories } from "@/lib/site-config";
import Reveal from "./Reveal";

export default function RealisationsGrid({ items }: { items: Realisation[] }) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((it) => it.category === filter)),
    [items, filter]
  );

  const availableCategories = useMemo(() => {
    const set = new Set(items.map((it) => it.category));
    return realisationCategories.filter((c) => set.has(c.value));
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-navy/20 bg-white px-8 py-20 text-center">
        <p className="font-serif text-2xl text-navy">Les réalisations arrivent prochainement</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-navy-mist">
          {"Maxime Rio ajoute progressivement les photos de ses chantiers depuis son espace privé. Revenez bientôt pour découvrir ses réalisations en images."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {availableCategories.length > 1 && (
        <div className="mb-10 flex flex-wrap gap-2">
          <FilterPill active={filter === "all"} onClick={() => setFilter("all")}>
            Tout voir
          </FilterPill>
          {availableCategories.map((c) => (
            <FilterPill key={c.value} active={filter === c.value} onClick={() => setFilter(c.value)}>
              {c.label}
            </FilterPill>
          ))}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, i) => (
          <Reveal key={item.publicId} delay={(i % 6) * 0.06}>
            <figure className="group relative overflow-hidden rounded-sm bg-navy">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={item.url}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">
                  {realisationCategories.find((c) => c.value === item.category)?.label ?? "Réalisation"}
                </span>
                <p className="mt-1 font-serif text-lg text-ivory">{item.title}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition-colors ${
        active
          ? "border-gold bg-gold text-navy-deep"
          : "border-navy/15 text-navy-mist hover:border-gold hover:text-gold-dark"
      }`}
    >
      {children}
    </button>
  );
}
