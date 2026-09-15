// Logique de calcul des créneaux disponibles, tenant compte des temps de trajet
// réels entre rendez-vous. Fonctions pures uniquement dans ce fichier (aucune
// dépendance serveur), afin qu'il reste importable depuis des composants client
// — voir bookingStatus.ts pour la vérification de configuration côté serveur.

export type ExistingAppointment = {
  address: string;
  startMinutes: number; // minutes depuis minuit, heure locale
  endMinutes: number;
};

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function toHHMM(minutes: number): string {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

/**
 * Calcule les créneaux de début possibles pour un nouveau rendez-vous, en
 * s'assurant que le temps de trajet depuis le rendez-vous précédent (ou le
 * point de départ de la journée) et vers le rendez-vous suivant (ou la fin
 * de journée) est toujours respecté.
 */
export function computeAvailableSlots(params: {
  workingStartMinutes: number;
  workingEndMinutes: number;
  slotDurationMinutes: number;
  slotGranularityMinutes: number;
  baseAddress: string;
  newAddress: string;
  existingAppointments: ExistingAppointment[]; // triés par startMinutes croissant
  travelMinutes: (from: string, to: string) => number;
}): string[] {
  const {
    workingStartMinutes,
    workingEndMinutes,
    slotDurationMinutes,
    slotGranularityMinutes,
    baseAddress,
    newAddress,
    existingAppointments,
    travelMinutes,
  } = params;

  const gaps: { prevAddress: string; prevEnd: number; nextAddress: string; nextStart: number }[] = [];
  let prevAddress = baseAddress;
  let prevEnd = workingStartMinutes;

  for (const appt of existingAppointments) {
    gaps.push({ prevAddress, prevEnd, nextAddress: appt.address, nextStart: appt.startMinutes });
    prevAddress = appt.address;
    prevEnd = appt.endMinutes;
  }
  gaps.push({ prevAddress, prevEnd, nextAddress: baseAddress, nextStart: workingEndMinutes });

  const slots: string[] = [];

  for (const gap of gaps) {
    const travelIn = travelMinutes(gap.prevAddress, newAddress);
    const travelOut = travelMinutes(newAddress, gap.nextAddress);
    const earliestStart = gap.prevEnd + travelIn;
    const latestStart = gap.nextStart - travelOut - slotDurationMinutes;

    if (latestStart < earliestStart) continue;

    let candidate = Math.ceil(earliestStart / slotGranularityMinutes) * slotGranularityMinutes;
    while (candidate <= latestStart) {
      slots.push(toHHMM(candidate));
      candidate += slotGranularityMinutes;
    }
  }

  return slots;
}
