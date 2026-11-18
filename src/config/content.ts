/**
 * Editable catalogue data (ids, images, seat numbers).
 * Display TEXT for each id lives in src/i18n/dictionaries/*.ts
 * Images refer to keys in src/config/photos.ts
 */
import type { PhotoKey } from "./photos";

/* ── FLEET ───────────────────────────────────────────────
 * Only 4 (smallest) and 56 (largest) are confirmed by the owner.
 * TODO (owner): fill exact seat counts for the middle categories,
 * e.g. seats: { exact: 7 } or seats: { upTo: 17 }. While null, the
 * site shows "Seating on request". Remove categories you don't run.
 */
export type Seats = { exact: number } | { upTo: number } | null;

export const fleet: { id: "car" | "suv" | "traveller" | "minibus" | "bus"; photo: PhotoKey; seats: Seats }[] = [
  { id: "car", photo: "car", seats: { exact: 4 } },
  { id: "suv", photo: "suv", seats: null },
  { id: "traveller", photo: "traveller", seats: null },
  { id: "minibus", photo: "minibus", seats: null },
  { id: "bus", photo: "bus", seats: { upTo: 56 } },
];

/* ── SERVICES ────────────────────────────────────────── */
export const services = [
  { id: "local", photo: "local" },
  { id: "outstation", photo: "outstation" },
  { id: "oneway", photo: "oneway" },
  { id: "roundtrip", photo: "roundtrip" },
  { id: "wedding", photo: "wedding" },
  { id: "corporate", photo: "corporate" },
  { id: "pilgrimage", photo: "pilgrimage" },
] as const satisfies readonly { id: string; photo: PhotoKey }[];
export type ServiceId = (typeof services)[number]["id"];

/* ── DESTINATIONS ─────────────────────────────────────
 * map: position on the India map (viewBox 0 0 600 670), computed from
 * real latitude/longitude. tags: used by the gallery filter chips.
 * Add a place: add a row here, a photo in photos.ts and its text in
 * every dictionary (destinations.items).
 */
export const destinationTags = ["gujarat", "pilgrimage", "hills", "heritage", "nature"] as const;
export type DestinationTag = (typeof destinationTags)[number];

export const destinations = [
  // Gujarat
  { id: "kutch", photo: "kutch", map: [46.4, 294.3], tags: ["gujarat", "nature"], focus: "50% 90%" },
  { id: "dwarka", photo: "dwarka", map: [28.9, 325.9], tags: ["gujarat", "pilgrimage"] },
  { id: "somnath", photo: "somnath", map: [57.0, 354.5], tags: ["gujarat", "pilgrimage"] },
  { id: "sou", photo: "sou", map: [122.4, 334.4], tags: ["gujarat", "heritage"] },
  { id: "saputara", photo: "saputara", map: [123.0, 361.3], tags: ["gujarat", "hills"] },
  { id: "ranikivav", photo: "ranikivav", map: [90.5, 291.5], tags: ["gujarat", "heritage"] },
  // Rajasthan
  { id: "udaipur", photo: "udaipur", map: [121.6, 276.2], tags: ["heritage"] },
  { id: "mountabu", photo: "mountabu", map: [102.5, 276.0], tags: ["hills"] },
  { id: "jaipur", photo: "jaipur", map: [163.1, 226.8], tags: ["heritage"] },
  { id: "jaisalmer", photo: "jaisalmer", map: [67.1, 226.8], tags: ["heritage", "nature"] },
  // North
  { id: "agra", photo: "agra", map: [207.3, 221.1], tags: ["heritage"] },
  { id: "varanasi", photo: "varanasi", map: [304.9, 260.5], tags: ["pilgrimage"] },
  { id: "ujjain", photo: "ujjain", map: [162.7, 306.0], tags: ["pilgrimage"] },
  { id: "amritsar", photo: "amritsar", map: [145.2, 126.9], tags: ["pilgrimage", "heritage"] },
  { id: "rishikesh", photo: "rishikesh", map: [212.9, 158.7], tags: ["pilgrimage", "hills"] },
  { id: "kedarnath", photo: "kedarnath", map: [227.6, 145.8], tags: ["pilgrimage", "hills"] },
  { id: "manali", photo: "manali", map: [190.6, 113.7], tags: ["hills"] },
  { id: "kashmir", photo: "kashmir", map: [143.6, 74.7], tags: ["hills", "nature"] },
  { id: "ladakh", photo: "ladakh", map: [198.3, 73.2], tags: ["hills", "nature"] },
  { id: "darjeeling", photo: "darjeeling", map: [408.4, 224.1], tags: ["hills"] },
  // West & South
  { id: "mumbai", photo: "mumbai", map: [105.8, 392.9], tags: ["heritage"] },
  { id: "goa", photo: "goa", map: [124.5, 469.1], tags: ["nature"] },
  { id: "hampi", photo: "hampi", map: [176.3, 472.5], tags: ["heritage"] },
  { id: "mysuru", photo: "mysuru", map: [180.0, 536.6], tags: ["heritage"] },
  { id: "ooty", photo: "ooty", map: [181.0, 555.7], tags: ["hills", "nature"] },
  { id: "tirupati", photo: "tirupati", map: [233.1, 507.5], tags: ["pilgrimage"] },
  { id: "kerala", photo: "kerala", map: [173.9, 596.2], tags: ["nature"] },
] as const satisfies readonly {
  id: string;
  photo: PhotoKey;
  map: readonly [number, number];
  tags: readonly DestinationTag[];
  focus?: string;
}[];
export type DestinationId = (typeof destinations)[number]["id"];

/** Our base, on the same map. */
export const homeBase = { map: [104.9, 348.6] as const };

/* ── REVIEWS ─────────────────────────────────────────────
 * Add ONLY genuine customer reviews (with their permission).
 * The section shows a friendly "coming soon" state while empty.
 * Example: { name: "Customer name", place: "Surat", text: "…", rating: 5, date: "2026-01" }
 */
export type Review = { name: string; place?: string; text: string; rating?: 1 | 2 | 3 | 4 | 5; date?: string };
export const reviews: Review[] = [];

/* ── SEASONS ──────────────────────────────────────────────
 * General best-time-to-visit picks (travel knowledge, not business claims).
 * Edit freely. Ids must exist in `destinations`.
 */
export const seasons = {
  winter: ["kutch", "jaisalmer", "udaipur", "jaipur", "agra", "varanasi", "goa", "hampi", "sou"],
  summer: ["manali", "kashmir", "ladakh", "darjeeling", "ooty", "mountabu", "kedarnath", "rishikesh"],
  monsoon: ["saputara", "sou", "udaipur", "mountabu", "ujjain", "somnath", "dwarka", "kerala"],
} as const satisfies Record<string, readonly DestinationId[]>;
export type Season = keyof typeof seasons;

/** Oct–Feb winter, Mar–Jun summer, Jul–Sep monsoon. */
export function seasonFor(date: Date): Season {
  const m = date.getMonth();
  if (m >= 6 && m <= 8) return "monsoon";
  if (m >= 2 && m <= 5) return "summer";
  return "winter";
}

/* ── DISTANCE ─────────────────────────────────────────────
 * Map coordinates were projected from real lat/long; invert that
 * projection to get straight-line (great-circle) distance from Surat.
 */
const MAP_K = 600 / ((98.0 - 67.5) * Math.cos((22 * Math.PI) / 180));
const toLatLon = ([x, y]: readonly [number, number]) => ({
  lat: 37.6 - y / MAP_K,
  lon: x / (Math.cos((22 * Math.PI) / 180) * MAP_K) + 67.5,
});
export function kmFromSurat(map: readonly [number, number]) {
  const a = { lat: 21.17, lon: 72.83 };
  const b = toLatLon(map);
  const r = (d: number) => (d * Math.PI) / 180;
  const h = Math.sin(r(b.lat - a.lat) / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(r(b.lon - a.lon) / 2) ** 2;
  const km = 2 * 6371 * Math.asin(Math.sqrt(h));
  return Math.max(10, Math.round(km / 10) * 10);
}

/* ── DESTINATION GALLERIES ──────────────────────────────
 * Extra photos per destination, shown as an auto-sliding carousel.
 * The first photo is always the destination's main `photo`.
 */
export const destinationGallery: Partial<Record<DestinationId, PhotoKey[]>> = {
  agra: ["g_agra_1", "g_agra_2"],
  amritsar: ["g_amritsar_1"],
  darjeeling: ["g_darjeeling_1"],
  dwarka: ["g_dwarka_1"],
  goa: ["g_goa_1", "g_goa_2"],
  hampi: ["g_hampi_1", "g_hampi_2"],
  jaipur: ["g_jaipur_1", "g_jaipur_2"],
  jaisalmer: ["g_jaisalmer_1", "g_jaisalmer_2"],
  kashmir: ["g_kashmir_1", "g_kashmir_2"],
  kedarnath: ["g_kedarnath_1", "g_kedarnath_2"],
  kerala: ["g_kerala_2"],
  kutch: ["g_kutch_1"],
  ladakh: ["g_ladakh_1", "g_ladakh_2"],
  manali: ["g_manali_1", "g_manali_2"],
  mountabu: ["g_mountabu_1", "g_mountabu_2"],
  mumbai: ["g_mumbai_1", "g_mumbai_2"],
  mysuru: ["g_mysuru_1"],
  ooty: ["g_ooty_1"],
  ranikivav: ["g_ranikivav_1"],
  rishikesh: ["g_rishikesh_1", "g_rishikesh_2"],
  saputara: ["g_saputara_1"],
  somnath: ["g_somnath_2"],
  sou: ["g_sou_1", "g_sou_2"],
  tirupati: ["g_tirupati_1", "g_tirupati_2"],
  udaipur: ["g_udaipur_1", "g_udaipur_2"],
  ujjain: ["g_ujjain_1", "g_ujjain_2"],
  varanasi: ["g_varanasi_1", "g_varanasi_2"],
};

export function destinationPhotos(id: DestinationId): PhotoKey[] {
  const d = destinations.find((x) => x.id === id)!;
  return [d.photo, ...(destinationGallery[id] ?? [])];
}
