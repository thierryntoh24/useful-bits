export type Locale = (typeof locales)[number];

export const locales = ["en", "fr"] as const;
// Map locale codes to their native names
export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};
export const defaultLocale: Locale = "en";
