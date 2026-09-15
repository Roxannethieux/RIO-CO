"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { realisationCategories } from "@/lib/site-config";

export default function AdminUploadForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/admin/realisations", { method: "POST", body: formData });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Échec de l'envoi.");
      formRef.current?.reset();
      setPreview(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'envoi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-5 rounded-sm border border-navy/10 bg-white p-6"
    >
      <h2 className="font-serif text-xl text-navy">Ajouter une photo</h2>

      <div>
        <label htmlFor="file" className="mb-1.5 block text-sm font-medium text-navy">
          Photo *
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept="image/*"
          required
          onChange={(e) => {
            const f = e.target.files?.[0];
            setPreview(f ? URL.createObjectURL(f) : null);
          }}
          className="w-full rounded-sm border border-navy/15 bg-ivory px-4 py-2.5 text-sm"
        />
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Aperçu"
            className="mt-3 h-40 w-full rounded-sm object-cover"
          />
        )}
      </div>

      <div>
        <label htmlFor="project" className="mb-1.5 block text-sm font-medium text-navy">
          Projet / chantier *
        </label>
        <input
          id="project"
          name="project"
          type="text"
          required
          placeholder="Ex. Rénovation salle de bain — Vincennes"
          className="w-full rounded-sm border border-navy/15 bg-ivory px-4 py-2.5 text-sm"
        />
        <p className="mt-1 text-xs text-navy-mist">
          Utilisez le même nom de projet pour toutes les photos d&apos;un même chantier — elles
          seront regroupées ensemble sur le site.
        </p>
      </div>

      <div>
        <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-navy">
          Type de photo *
        </label>
        <select
          id="role"
          name="role"
          required
          defaultValue="photo"
          className="w-full rounded-sm border border-navy/15 bg-ivory px-4 py-2.5 text-sm"
        >
          <option value="photo">Photo simple</option>
          <option value="avant">Avant travaux</option>
          <option value="apres">Après travaux</option>
        </select>
      </div>

      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-navy">
          Titre de la photo *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="Ex. Vue de la douche"
          className="w-full rounded-sm border border-navy/15 bg-ivory px-4 py-2.5 text-sm"
        />
      </div>

      <div>
        <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-navy">
          Catégorie *
        </label>
        <select
          id="category"
          name="category"
          required
          className="w-full rounded-sm border border-navy/15 bg-ivory px-4 py-2.5 text-sm"
        >
          {realisationCategories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-navy">
          Description du projet (optionnel)
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="w-full rounded-sm border border-navy/15 bg-ivory px-4 py-2.5 text-sm"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-sm bg-navy px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-ivory hover:bg-navy-light disabled:opacity-60"
      >
        {loading ? "Envoi en cours…" : "Publier la photo"}
      </button>
    </form>
  );
}
