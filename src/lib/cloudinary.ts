import { v2 as cloudinary } from "cloudinary";

const FOLDER = "rio-co/realisations";
const VIDEO_FOLDER = "rio-co/realisations-videos";
const VIDEO_TAG = "rio-co-video";

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

function parseVideoCategory(tags: string[] | undefined) {
  return (tags ?? []).find((t) => t !== VIDEO_TAG) ?? "autre";
}

function parseRole(value: string | undefined): PhotoRole {
  return value === "avant" || value === "apres" ? value : "photo";
}

type ContextShape = {
  custom?: Record<string, string>;
  [key: string]: unknown;
};

// L'API Search de Cloudinary ne renvoie pas toujours le contexte imbriqué
// sous "custom" comme l'API Upload/Admin (parfois les champs sont à plat
// directement sous "context") : on lit donc les deux formes possibles.
function readContext(context: ContextShape | undefined, key: string): string | undefined {
  if (!context) return undefined;
  const flat = context[key];
  if (typeof flat === "string") return flat;
  return context.custom?.[key];
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
        context?: ContextShape;
        tags?: string[];
        created_at: string;
      }) => ({
        publicId: r.public_id,
        url: r.secure_url,
        width: r.width,
        height: r.height,
        title: readContext(r.context, "title") ?? "Réalisation",
        description: readContext(r.context, "description") ?? "",
        category: parseCategory(r.tags),
        project: readContext(r.context, "project") ?? "",
        role: parseRole(readContext(r.context, "role")),
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

export async function updateRealisation(
  publicId: string,
  params: {
    title: string;
    description: string;
    category: string;
    project: string;
    role: PhotoRole;
  }
) {
  configure();
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary n'est pas configuré.");
  }

  await cloudinary.uploader.explicit(publicId, {
    type: "upload",
    tags: ["rio-co", params.category],
    context: {
      title: params.title,
      description: params.description,
      project: params.project,
      role: params.role,
    },
  });
}

export async function deleteRealisation(publicId: string) {
  configure();
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary n'est pas configuré.");
  }
  await cloudinary.uploader.destroy(publicId);
}

export type RealisationVideo = {
  publicId: string;
  url: string;
  title: string;
  description: string;
  category: string;
  project: string;
  createdAt: string;
};

export async function listRealisationVideos(): Promise<RealisationVideo[]> {
  configure();
  if (!isCloudinaryConfigured()) return [];

  try {
    const result = await cloudinary.search
      .expression(`folder:${VIDEO_FOLDER} AND resource_type:video`)
      .with_field("context")
      .with_field("tags")
      .sort_by("created_at", "desc")
      .max_results(200)
      .execute();

    return (result.resources ?? []).map(
      (r: {
        public_id: string;
        secure_url: string;
        context?: ContextShape;
        tags?: string[];
        created_at: string;
      }) => ({
        publicId: r.public_id,
        url: r.secure_url,
        title: readContext(r.context, "title") ?? "Réalisation",
        description: readContext(r.context, "description") ?? "",
        category: parseVideoCategory(r.tags),
        project: readContext(r.context, "project") ?? "",
        createdAt: r.created_at,
      })
    );
  } catch (error) {
    console.error("[cloudinary] Échec de récupération des vidéos", error);
    return [];
  }
}

// Retire les caractères qui casseraient l'encodage "clé=valeur|clé2=valeur2"
// du contexte Cloudinary lors de la signature manuelle (upload direct
// navigateur → Cloudinary, sans repasser par notre serveur pour les grosses
// vidéos).
function sanitizeForContext(value: string): string {
  return value.replace(/[|=]/g, " ").trim();
}

export function signVideoUpload(params: {
  title: string;
  description: string;
  category: string;
  project: string;
}) {
  configure();
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary n'est pas configuré.");
  }

  const timestamp = Math.round(Date.now() / 1000);
  const tags = [VIDEO_TAG, params.category].join(",");
  const context = [
    `title=${sanitizeForContext(params.title)}`,
    `description=${sanitizeForContext(params.description)}`,
    `project=${sanitizeForContext(params.project)}`,
    `category=${sanitizeForContext(params.category)}`,
  ].join("|");

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: VIDEO_FOLDER, tags, context },
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    folder: VIDEO_FOLDER,
    tags,
    context,
  };
}

export async function updateRealisationVideo(
  publicId: string,
  params: { title: string; description: string; category: string; project: string }
) {
  configure();
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary n'est pas configuré.");
  }

  await cloudinary.uploader.explicit(publicId, {
    resource_type: "video",
    type: "upload",
    tags: [VIDEO_TAG, params.category],
    context: {
      title: params.title,
      description: params.description,
      project: params.project,
      category: params.category,
    },
  });
}

export async function deleteRealisationVideo(publicId: string) {
  configure();
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary n'est pas configuré.");
  }
  await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
}
