import "server-only";
import type { Locale } from "./config";
import en from "./dictionaries/en";
import gu from "./dictionaries/gu";
import hi from "./dictionaries/hi";
import type { Dictionary } from "./dictionaries/en";

const dictionaries: Record<Locale, Dictionary> = { en, gu, hi };
export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];
export type { Dictionary };
