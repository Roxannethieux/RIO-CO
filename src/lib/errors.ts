/**
 * Le SDK Cloudinary rejette parfois avec un objet simple ({ message, http_code })
 * plutôt qu'une vraie instance d'Error — sans ce repli, le message précis de
 * l'erreur (ex. "Invalid cloud_name") était perdu au profit d'un texte générique.
 */
export function extractErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return fallback;
}
