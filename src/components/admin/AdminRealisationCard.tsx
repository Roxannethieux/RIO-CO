"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Realisation } from "@/lib/cloudinary";
import { realisationCategories } from "@/lib/site-config";
import RoleBadge from "@/components/RoleBadge";

export default function AdminRealisationCard({ item }: { item: Realisation }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Supprimer « ${item.title} » ?`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/realisations/${item.publicId}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Échec de la suppression.");
      }
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Échec de la suppression.");
      setDeleting(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-sm border border-navy/10 bg-white">
      <div className="relative aspect-[4/3] w-full">
        <Image src={item.url} alt={item.title} fill sizes="300px" className="object-cover" />
        <RoleBadge role={item.role} side="left" />
      </div>
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-gold-dark">
            {realisationCategories.find((c) => c.value === item.category)?.label}
          </span>
        </div>
        {item.project && (
          <p className="mt-1.5 truncate text-xs font-semibold uppercase tracking-wide text-navy/60">
            {item.project}
          </p>
        )}
        <p className="mt-1 truncate text-sm font-medium text-navy">{item.title}</p>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="mt-3 w-full rounded-sm border border-red-200 py-2 text-xs font-semibold uppercase tracking-wide text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          {deleting ? "Suppression…" : "Supprimer"}
        </button>
      </div>
    </div>
  );
}
