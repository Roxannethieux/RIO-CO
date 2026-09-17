import type { Realisation, RealisationVideo } from "./cloudinary";

export type ProjectGroup = {
  key: string;
  projectName: string;
  category: string;
  description: string;
  pairs: { before: Realisation; after: Realisation }[];
  photos: Realisation[];
  video?: RealisationVideo;
  createdAt: string;
};

/**
 * Regroupe les photos par chantier (champ "project") ET par pièce (champ
 * "category") : un même chantier peut couvrir plusieurs pièces (ex. "Chantier
 * X" avec une chambre et une cuisine rénovées), chacune formant sa propre
 * fiche avec son propre appariement avant/après — sans quoi l'avant d'une
 * pièce pourrait se retrouver apparié à l'après d'une autre pièce du même
 * chantier.
 *
 * Une photo sans projet renseigné forme son propre groupe (repli sur son
 * titre). Les photos "avant" et "après" d'une même fiche sont appariées par
 * ordre d'ajout ; les photos excédentaires rejoignent les photos
 * complémentaires de la fiche.
 */
export function groupByProject(items: Realisation[]): ProjectGroup[] {
  type Draft = {
    projectName: string;
    category: string;
    avant: Realisation[];
    apres: Realisation[];
    photos: Realisation[];
    createdAt: string;
  };

  const map = new Map<string, Draft>();

  for (const item of items) {
    const project = item.project.trim();
    const key = project ? `${project}::${item.category}` : `single-${item.publicId}`;
    let group = map.get(key);
    if (!group) {
      group = {
        projectName: project || item.title,
        category: item.category,
        avant: [],
        apres: [],
        photos: [],
        createdAt: item.createdAt,
      };
      map.set(key, group);
    }

    if (item.role === "avant") group.avant.push(item);
    else if (item.role === "apres") group.apres.push(item);
    else group.photos.push(item);

    if (new Date(item.createdAt).getTime() > new Date(group.createdAt).getTime()) {
      group.createdAt = item.createdAt;
    }
  }

  return Array.from(map.entries())
    .map(([key, g]) => {
      const pairCount = Math.min(g.avant.length, g.apres.length);
      const pairs = Array.from({ length: pairCount }, (_, i) => ({
        before: g.avant[i],
        after: g.apres[i],
      }));
      const leftovers = [...g.avant.slice(pairCount), ...g.apres.slice(pairCount)];
      const photos = [...leftovers, ...g.photos];

      // Description affichée sous la photo : on privilégie le texte de la
      // photo "après" (le résultat des travaux), puis "avant", puis la
      // première photo complémentaire disponible.
      const description =
        pairs[0]?.after.description || pairs[0]?.before.description || photos[0]?.description || "";

      return {
        key,
        projectName: g.projectName,
        category: g.category,
        description,
        pairs,
        photos,
        createdAt: g.createdAt,
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Associe à chaque fiche la vidéo du même chantier/pièce (même clé
 * projet::catégorie que pour les photos). Une vidéo sans photo
 * correspondante forme sa propre fiche plutôt que d'être perdue.
 */
export function attachVideos(groups: ProjectGroup[], videos: RealisationVideo[]): ProjectGroup[] {
  const result = groups.map((g) => ({ ...g }));
  const indexByKey = new Map(result.map((g, i) => [g.key, i]));

  for (const video of videos) {
    const project = video.project.trim();
    const key = project ? `${project}::${video.category}` : `single-video-${video.publicId}`;
    const existingIndex = indexByKey.get(key);

    if (existingIndex !== undefined) {
      result[existingIndex].video = video;
      if (!result[existingIndex].description) {
        result[existingIndex].description = video.description;
      }
    } else {
      const group: ProjectGroup = {
        key,
        projectName: project || video.title,
        category: video.category,
        description: video.description,
        pairs: [],
        photos: [],
        video,
        createdAt: video.createdAt,
      };
      indexByKey.set(key, result.length);
      result.push(group);
    }
  }

  return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
