// Isolé de booking.ts pour que les fonctions pures de booking.ts restent
// importables par des composants client sans entraîner le driver Postgres
// (module Node-only) dans le bundle navigateur.

import { isDbConfigured } from "./db";
import { isGoogleMapsConfigured } from "./googleMaps";
import { bookingConfig } from "./site-config";

/** La prise de RDV en ligne nécessite la base de données, Google Maps et une adresse de départ. */
export function isBookingSystemConfigured(): boolean {
  return isDbConfigured() && isGoogleMapsConfigured() && !bookingConfig.baseAddress.startsWith("[");
}
