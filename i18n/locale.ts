"use server";

import { defaultLocale, Locale } from "@/i18n/config";
import { cookies } from "next/headers";

const COOKIE_NAME = "NEXT_LOCALE";

/**
 * Detects locale from cookies if set, otherwise falls back to browser default.
 * For SSR, tries the `accept-language` header.
 */
export async function getUserLocale() {
  const storedLocale = await getCookieLocale();
  if (storedLocale) {
    console.log("[LOCALE] Stored locale (Cookie)", storedLocale);
    return storedLocale as Locale;
  }

  // SSR: Try detecting from the Accept-Language header
  const acceptLang = (await (await import("next/headers")).headers()).get(
    "accept-language",
  );
  if (acceptLang) {
    const preferred = acceptLang.split(",")[0].split("-")[0];
    return (preferred as Locale) || defaultLocale;
  }

  // Client fallback: detect from navigator.language (runs only in browser)
  if (typeof window !== "undefined") {
    const browserLang = navigator.language || navigator.languages[0];
    const shortCode = browserLang?.split("-")[0] as Locale;
    return shortCode || defaultLocale;
  }

  return defaultLocale;
}

export async function getCookieLocale() {
  return (await cookies()).get(COOKIE_NAME)?.value;
}

export async function setUserLocale(locale: Locale) {
  (await cookies()).set(COOKIE_NAME, locale, {
    maxAge: 1000 * 60 * 60 * 24 * 60,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function clearUserLocale() {
  (await cookies()).delete(COOKIE_NAME);
}
