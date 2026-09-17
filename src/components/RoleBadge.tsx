import type { PhotoRole } from "@/lib/cloudinary";

/**
 * Mention "Avant" / "Après" incrustée par le site lui-même (jamais dans le
 * fichier image) — garantit un rendu identique sur toutes les photos, sans
 * dépendre d'un post-traitement fait par le client avant l'envoi.
 */
export default function RoleBadge({
  role,
  side = "left",
  size = "md",
}: {
  role: PhotoRole;
  side?: "left" | "right";
  size?: "md" | "sm";
}) {
  if (role === "photo") return null;

  return (
    <span
      className={`pointer-events-none absolute top-2 ${side === "left" ? "left-2" : "right-2"} rounded-sm bg-navy-deep/85 font-semibold uppercase tracking-[0.12em] text-gold ${
        size === "sm" ? "px-1.5 py-0.5 text-[8px]" : "px-2 py-1 text-[10px]"
      }`}
    >
      {role === "avant" ? "Avant" : "Après"}
    </span>
  );
}
