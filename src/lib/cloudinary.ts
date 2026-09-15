import { v2 as cloudinary } from "cloudinary";

const FOLDER = "rio-co/realisations";

let configured = false;

function configure() {
  if (configured) return;
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;

  if (cloud_name && api_key && api_secret) {
    cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
  }
  configured = true;
}

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

export type PhotoRole = "avant" | "apres" | "photo";

export type Realisation = {
  publicId: string;
  url: string;
  width: number;
  height: number;
  title: string;
  description: string;
  category: string;
  project: string;
  role: PhotoRole;
  createdAt: string;
};

function parseCategory(tags: string[] | undefined) {
  return (tags ?? []).find((t) => t !== "rio-co") ?? "autre";
}

function parseRole(value: string | undefined): PhotoRole {
  return value === "avant" || value === "apres" ? value : "photo";
}

export async function listRealisations(): Promise<Realisation[]> {
  configure();
  if (!isCloudinaryConfigured()) return [];

  try {
    const result = await cloudinary.search
      .expression(`folder:${FOLDER}`)
      .with_field("context")
      .with_field("tags")
      .sort_by("created_at", "desc")
      .max_results(200)
      .execute();

    return (result.resources ?? []).map(
      (r: {
        public_id: string;
        secure_url: string;
        width: number;
        height: number;
        context?: {
          custom?: { title?: string; description?: string; project?: string; role?: string };
        };
        tags?: string[];
        created_at: string;
      }) => ({
        publicId: r.public_id,
        url: r.secure_url,
        width: r.width,
        height: r.height,
        title: r.context?.custom?.title ?? "Réalisation",
        description: r.context?.custom?.description ?? "",
        category: parseCategory(r.tags),
        project: r.context?.custom?.project ?? "",
        role: parseRole(r.context?.custom?.role),
        createdAt: r.created_at,
      })
    );
  } catch (error) {
    // Une réalisation ne doit jamais faire échouer le rendu ou la construction du site :
    // en cas de souci Cloudinary (identifiants, réseau, quota…), on affiche simplement
    // une galerie vide plutôt que de faire planter la page.
    console.error("[cloudinary] Échec de récupération des réalisations", error);
    return [];
  }
}

export async function uploadRealisation(params: {
  fileDataUrl: string;
  title: string;
  description: string;
  category: string;
  project: string;
  role: PhotoRole;
}) {
  configure();
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary n'est pas configuré (variables d'environnement manquantes).");
  }

  const result = await cloudinary.uploader.upload(params.fileDataUrl, {
    folder: FOLDER,
    tags: ["rio-co", params.category],
    context: {
      title: params.title,
      description: params.description,
      project: params.project,
      role: params.role,
    },
  });

  return result;
}

export async function deleteRealisation(publicId: string) {
  configure();
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary n'est pas configuré.");
  }
  await cloudinary.uploader.destroy(publicId);
}
