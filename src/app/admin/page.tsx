import Link from "next/link";
import {
  listRealisations,
  listRealisationVideos,
  isCloudinaryConfigured,
  type Realisation,
  type RealisationVideo,
} from "@/lib/cloudinary";
import AdminUploadForm from "@/components/admin/AdminUploadForm";
import AdminRealisationCard from "@/components/admin/AdminRealisationCard";
import AdminVideoUploadForm from "@/components/admin/AdminVideoUploadForm";
import AdminVideoCard from "@/components/admin/AdminVideoCard";
import LogoutButton from "@/components/admin/LogoutButton";
import Logo from "@/components/Logo";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const configured = isCloudinaryConfigured();
  const [items, videos] = configured
    ? await Promise.all([listRealisations(), listRealisationVideos()])
    : [[] as Realisation[], [] as RealisationVideo[]];
  const existingProjects = Array.from(
    new Set([...items.map((i) => i.project), ...videos.map((v) => v.project)].filter(Boolean))
  );

  return (
    <div className="min-h-screen bg-ivory-dim">
      <header className="flex items-center justify-between border-b border-navy/10 bg-navy px-6 py-5 sm:px-10">
        <Logo variant="light" />
        <LogoutButton />
      </header>

      <div className="container-xl py-12">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-3xl text-navy">Gestion des réalisations</h1>
          <Link
            href="/admin/rendez-vous"
            className="text-sm font-semibold uppercase tracking-wide text-gold-dark hover:text-gold"
          >
            Rendez-vous →
          </Link>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-navy-mist">
          Ajoutez ici les photos de vos chantiers terminés. Chaque photo publiée apparaît
          immédiatement dans la galerie du site public.
        </p>

        {!configured && (
          <div className="mt-8 rounded-sm border border-amber-300 bg-amber-50 px-6 py-5 text-sm text-amber-900">
            <strong>Stockage des photos non configuré.</strong> Ajoutez les variables
            d&apos;environnement <code>CLOUDINARY_CLOUD_NAME</code>, <code>CLOUDINARY_API_KEY</code>{" "}
            et <code>CLOUDINARY_API_SECRET</code> (voir le fichier <code>README.md</code>) pour
            activer l&apos;ajout de photos.
          </div>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-[380px_1fr]">
          <AdminUploadForm existingProjects={existingProjects} />

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-sans text-lg font-semibold text-navy">
                {items.length} réalisation{items.length > 1 ? "s" : ""} publiée
                {items.length > 1 ? "s" : ""}
              </h2>
            </div>
            {items.length === 0 ? (
              <p className="rounded-sm border border-dashed border-navy/20 bg-white px-6 py-10 text-center text-sm text-navy-mist">
                Aucune réalisation publiée pour le moment.
              </p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                  <AdminRealisationCard
                    key={item.publicId}
                    item={item}
                    existingProjects={existingProjects}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 grid gap-10 border-t border-navy/10 pt-16 lg:grid-cols-[380px_1fr]">
          <AdminVideoUploadForm existingProjects={existingProjects} />

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-sans text-lg font-semibold text-navy">
                {videos.length} vidéo{videos.length > 1 ? "s" : ""} publiée
                {videos.length > 1 ? "s" : ""}
              </h2>
            </div>
            {videos.length === 0 ? (
              <p className="rounded-sm border border-dashed border-navy/20 bg-white px-6 py-10 text-center text-sm text-navy-mist">
                Aucune vidéo publiée pour le moment.
              </p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {videos.map((item) => (
                  <AdminVideoCard
                    key={item.publicId}
                    item={item}
                    existingProjects={existingProjects}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
