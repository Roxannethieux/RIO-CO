import type { Realisation } from "./cloudinary";

export type ProjectGroup = {
  key: string;
  projectName: string;
  category: string;
  description: string;
  pairs: { before: Realisation; after: Realisation }[];
  photos: Realisation[];
  createdAt: string;
};

/**
 * Regroupe les photos par chantier (champ "project" renseigné en back-office).
 * Une photo sans projet renseigné forme son propre groupe (repli sur son titre).
 * Les photos "avant" et "après" d'un même projet sont appariées par ordre d'ajout ;
 * les photos excédentaires rejoignent la liste des photos complémentaires du projet.
 */
export function groupByProject(items: Realisation[]): ProjectGroup[] {
  type Draft = {
    projectName: string;
    category: string;
    description: string;
    avant: Realisation[];
    apres: Realisation[];
    photos: Realisation[];
    createdAt: string;
  };

  const map = new Map<string, Draft>();

  for (const item of items) {
    const key = item.project.trim() || `single-${item.publicId}`;
    let group = map.get(key);
    if (!group) {
      group = {
        projectName: item.project.trim() || item.title,
        category: item.category,
        description: item.description,
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
      return {
        key,
        projectName: g.projectName,
        category: g.category,
        description: g.description,
        pairs,
        photos: [...leftovers, ...g.photos],
        createdAt: g.createdAt,
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
