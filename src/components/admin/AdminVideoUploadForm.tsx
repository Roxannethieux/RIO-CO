"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { realisationCategories } from "@/lib/site-config";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 Mo (limite Cloudinary plan gratuit)

export default function AdminVideoUploadForm({
  existingProjects = [],
}: {
  existingProjects?: string[];
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file");
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const category = String(formData.get("category") || "").trim();
    const project = String(formData.get("project") || "").trim();

    if (!(file instanceof File)) {
      setError("Aucune vidéo fournie.");
      setLoading(false);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Vidéo trop volumineuse (100 Mo maximum).");
      setLoading(false);
      return;
    }

    try {
      // La vidéo part directement du navigateur vers Cloudinary : elle ne
      // passe jamais par notre serveur, qui ne pourrait pas encaisser un
      // fichier aussi volumineux (limite de taille des fonctions Vercel).
      const signRes = await fetch("/api/admin/videos/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category, project }),
      });
      const signed = await signRes.json();
      if (!signRes.ok) throw new Error(signed.error || "Échec de la préparation de l'envoi.");

      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("api_key", signed.apiKey);
      uploadData.append("timestamp", String(signed.timestamp));
      uploadData.append("signature", signed.signature);
      uploadData.append("folder", signed.folder);
      uploadData.append("tags", signed.tags);
      uploadData.append("context", signed.context);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${signed.cloudName}/video/upload`,
        { method: "POST", body: uploadData }
      );
      if (!uploadRes.ok) {
        const uploadBody = await uploadRes.json().catch(() => ({}));
        throw new Error(uploadBody.error?.message || "Échec de l'envoi de la vidéo.");
      }

      await fetch("/api/admin/videos/revalidate", { method: "POST" });

      formRef.current?.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'envoi de la vidéo.");
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
      <h2 className="font-serif text-xl text-navy">Ajouter une vidéo</h2>

      <div>
        <label htmlFor="video-file" className="mb-1.5 block text-sm font-medium text-navy">
          Vidéo *
        </label>
        <input
          id="video-file"
          name="file"
          type="file"
          accept="video/*"
          required
          className="w-full rounded-sm border border-navy/15 bg-ivory px-4 py-2.5 text-sm"
        />
        <p className="mt-1 text-xs text-navy-mist">100 Mo maximum.</p>
      </div>

      <div>
        <label htmlFor="video-project" className="mb-1.5 block text-sm font-medium text-navy">
          Projet / chantier *
        </label>
        <input
          id="video-project"
          name="project"
          type="text"
          required
          list="existing-projects-video"
          placeholder="Ex. Rénovation salle de bain — Vincennes"
          className="w-full rounded-sm border border-navy/15 bg-ivory px-4 py-2.5 text-sm"
        />
        {existingProjects.length > 0 && (
          <datalist id="existing-projects-video">
            {existingProjects.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        )}
        <p className="mt-1 text-xs text-navy-mist">
          Utilisez le même nom de projet que les photos du chantier pour que la vidéo
          apparaisse sur la même fiche.
        </p>
      </div>

      <div>
        <label htmlFor="video-title" className="mb-1.5 block text-sm font-medium text-navy">
          Titre *
        </label>
        <input
          id="video-title"
          name="title"
          type="text"
          required
          placeholder="Ex. Visite du chantier terminé"
          className="w-full rounded-sm border border-navy/15 bg-ivory px-4 py-2.5 text-sm"
        />
      </div>

      <div>
        <label htmlFor="video-category" className="mb-1.5 block text-sm font-medium text-navy">
          Catégorie *
        </label>
        <select
          id="video-category"
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
        <label htmlFor="video-description" className="mb-1.5 block text-sm font-medium text-navy">
          Description (optionnel)
        </label>
        <textarea
          id="video-description"
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
        {loading ? "Envoi en cours… (peut prendre un moment)" : "Publier la vidéo"}
      </button>
    </form>
  );
}
