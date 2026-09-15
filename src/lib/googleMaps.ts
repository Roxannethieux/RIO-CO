export function isGoogleMapsConfigured() {
  return Boolean(process.env.GOOGLE_MAPS_API_KEY);
}

export class AddressNotFoundError extends Error {
  constructor(address: string) {
    super(`Adresse non reconnue par Google Maps : ${address}`);
    this.name = "AddressNotFoundError";
  }
}

/** Erreur de configuration/service (clé invalide, quota, API non activée…) — distincte d'une adresse invalide. */
export class GoogleMapsServiceError extends Error {
  constructor(status: string, message?: string) {
    super(`Service Google Maps indisponible (${status}${message ? ` — ${message}` : ""}).`);
    this.name = "GoogleMapsServiceError";
  }
}

const ADDRESS_LEVEL_STATUSES = new Set(["ZERO_RESULTS", "INVALID_REQUEST"]);

/**
 * Interroge l'API Google Distance Matrix pour obtenir les temps de trajet
 * (en minutes) entre chaque paire d'adresses fournies, en un seul appel.
 * Retourne une fonction de lookup (from, to) => minutes.
 *
 * Sécurité : en l'absence de configuration ou d'échec de l'API, cette
 * fonction lève une erreur plutôt que de retourner un temps de trajet nul
 * par défaut — un temps de trajet ignoré pourrait conduire à proposer des
 * créneaux réellement infaisables pour l'artisan.
 */
export async function buildTravelMatrix(
  addresses: string[]
): Promise<(from: string, to: string) => number> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_MAPS_API_KEY n'est pas configurée.");
  }

  const unique = Array.from(new Set(addresses.filter((a) => a.trim().length > 0)));
  if (unique.length <= 1) {
    return () => 0;
  }

  const list = unique.map(encodeURIComponent).join("|");
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${list}&destinations=${list}&key=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Échec de l'appel à Google Distance Matrix (HTTP ${res.status}).`);
  }

  const data = await res.json();
  if (data.status !== "OK") {
    throw new GoogleMapsServiceError(data.status, data.error_message);
  }

  const matrix = new Map<string, number>();
  unique.forEach((origin, i) => {
    unique.forEach((dest, j) => {
      const element = data.rows?.[i]?.elements?.[j];
      if (element?.status === "OK") {
        matrix.set(`${origin}|${dest}`, Math.ceil(element.duration.value / 60));
      }
    });
  });

  return (from: string, to: string) => {
    if (from === to) return 0;
    const value = matrix.get(`${from}|${to}`);
    if (value === undefined) {
      // Une adresse connue (rendez-vous existant) qui échoue ponctuellement :
      // on applique une marge de sécurité plutôt que de planter la disponibilité.
      return 45;
    }
    return value;
  };
}

/** Vérifie qu'une adresse est reconnue par Google Maps (utilisé à la création d'un RDV). */
export async function validateAddress(address: string): Promise<void> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_MAPS_API_KEY n'est pas configurée.");
  }
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.status === "OK" && data.results?.length) return;

  if (ADDRESS_LEVEL_STATUSES.has(data.status)) {
    throw new AddressNotFoundError(address);
  }
  throw new GoogleMapsServiceError(data.status, data.error_message);
}
