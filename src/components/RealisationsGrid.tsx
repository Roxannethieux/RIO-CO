"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { ProjectGroup } from "@/lib/realisations";
import { realisationCategories } from "@/lib/site-config";
import Reveal from "./Reveal";
import BeforeAfter from "./BeforeAfter";

export default function RealisationsGrid({ groups }: { groups: ProjectGroup[] }) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(
    () => (filter === "all" ? groups : groups.filter((g) => g.category === filter)),
    [groups, filter]
  );

  const availableCategories = useMemo(() => {
    const set = new Set(groups.map((g) => g.category));
    return realisationCategories.filter((c) => set.has(c.value));
  }, [groups]);

  if (groups.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-navy/20 bg-white px-8 py-20 text-center">
        <p className="font-serif text-2xl text-navy">Les réalisations arrivent prochainement</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-navy-mist">
          J&apos;ajoute progressivement les photos de mes chantiers depuis mon espace privé.
          Revenez bientôt pour les découvrir en images.
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
        {filtered.map((group, i) => (
          <Reveal key={group.key} delay={(i % 6) * 0.06}>
            <article className="overflow-hidden rounded-sm border border-navy/10 bg-white">
              {group.pairs.length > 0 ? (
                <BeforeAfter before={group.pairs[0].before} after={group.pairs[0].after} />
              ) : group.photos[0] ? (
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={group.photos[0].url}
                    alt={group.photos[0].title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : null}

              {group.photos.length > (group.pairs.length > 0 ? 0 : 1) && (
                <div className="grid grid-cols-4 gap-0.5">
                  {group.photos.slice(group.pairs.length > 0 ? 0 : 1, group.pairs.length > 0 ? 4 : 5).map((p) => (
                    <div key={p.publicId} className="relative aspect-square">
                      <Image src={p.url} alt={p.title} fill sizes="120px" className="object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <div className="p-5">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-gold-dark">
                  {realisationCategories.find((c) => c.value === group.category)?.label ?? "Réalisation"}
                </span>
                <p className="mt-1 font-serif text-lg text-navy">{group.projectName}</p>
                {group.description && (
                  <p className="mt-1 text-sm leading-relaxed text-navy-mist">{group.description}</p>
                )}
              </div>
            </article>
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
