"use client";
import { createContext, useContext } from "react";
import type { Dictionary } from "./dictionaries/en";
import type { Locale } from "./config";

type Ctx = { dict: Dictionary; locale: Locale };
const DictionaryContext = createContext<Ctx | null>(null);

export function DictionaryProvider({ dict, locale, children }: Ctx & { children: React.ReactNode }) {
  return <DictionaryContext.Provider value={{ dict, locale }}>{children}</DictionaryContext.Provider>;
}

export function useDictionary() {
  const ctx = useContext(DictionaryContext);
  if (!ctx) throw new Error("useDictionary must be used inside DictionaryProvider");
  return ctx;
}

/** Replace {n} placeholders. */
export const fmt = (s: string, n: number | string) => s.replace("{n}", String(n));
