"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { RealisationVideo } from "@/lib/cloudinary";
import { realisationCategories } from "@/lib/site-config";

export default function AdminVideoCard({
  item,
  existingProjects = [],
}: {
  item: RealisationVideo;
  existingProjects?: string[];
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);

  async function handleDelete() {
    if (!confirm(`Supprimer la vidéo « ${item.title} » ?`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/videos/${item.publicId}`, { method: "DELETE" });
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

  if (editing) {
    return (
      <AdminVideoEditForm
        item={item}
        existingProjects={existingProjects}
        onCancel={() => setEditing(false)}
        onSaved={() => {
          setEditing(false);
          router.refresh();
        }}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-sm border border-navy/10 bg-white">
      <div className="relative aspect-[4/3] w-full bg-navy-deep">
        <video src={item.url} controls playsInline preload="metadata" className="h-full w-full" />
      </div>
      <div className="p-4">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-gold-dark">
          {realisationCategories.find((c) => c.value === item.category)?.label}
        </span>
        {item.project && (
          <p className="mt-1.5 truncate text-xs font-semibold uppercase tracking-wide text-navy/60">
            {item.project}
          </p>
        )}
        <p className="mt-1 truncate text-sm font-medium text-navy">{item.title}</p>
        {item.description && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-navy-mist">
            {item.description}
          </p>
        )}
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex-1 rounded-sm border border-navy/20 py-2 text-xs font-semibold uppercase tracking-wide text-navy hover:bg-ivory-dim"
          >
            Modifier
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 rounded-sm border border-red-200 py-2 text-xs font-semibold uppercase tracking-wide text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            {deleting ? "Suppression…" : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminVideoEditForm({
  item,
  existingProjects,
  onCancel,
  onSaved,
}: {
  item: RealisationVideo;
  existingProjects: string[];
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [project, setProject] = useState(item.project);
  const [title, setTitle] = useState(item.title);
  const [category, setCategory] = useState(item.category);
  const [description, setDescription] = useState(item.description);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/videos/${item.publicId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project, title, category, description }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Échec de la modification.");
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de la modification.");
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 overflow-hidden rounded-sm border border-gold/40 bg-white p-4"
    >
      <div className="relative aspect-[4/3] w-full bg-navy-deep">
        <video src={item.url} controls playsInline preload="metadata" className="h-full w-full" />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-navy">Projet / chantier</label>
        <input
          value={project}
          onChange={(e) => setProject(e.target.value)}
          required
          list={`existing-projects-video-${item.publicId}`}
          className="w-full rounded-sm border border-navy/15 bg-ivory px-3 py-2 text-sm"
        />
        {existingProjects.length > 0 && (
          <datalist id={`existing-projects-video-${item.publicId}`}>
            {existingProjects.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        )}
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-navy">Titre</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-sm border border-navy/15 bg-ivory px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-navy">Catégorie</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-sm border border-navy/15 bg-ivory px-3 py-2 text-sm"
        >
          {realisationCategories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-navy">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-sm border border-navy/15 bg-ivory px-3 py-2 text-sm"
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="flex-1 rounded-sm border border-navy/20 py-2 text-xs font-semibold uppercase tracking-wide text-navy hover:bg-ivory-dim disabled:opacity-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 rounded-sm bg-navy py-2 text-xs font-semibold uppercase tracking-wide text-ivory hover:bg-navy-light disabled:opacity-60"
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
