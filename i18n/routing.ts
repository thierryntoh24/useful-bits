import { defaultLocale, locales } from "@/i18n/config";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales,
  defaultLocale,

  // The `pathnames` object holds pairs of internal and
  // external paths. Based on the locale, the external
  // paths are rewritten to the shared, internal ones.
  pathnames: {
    // If all locales use the same pathname, a single
    // external path can be used for all locales
    "/": "/",
    "/blog": "/blog",

    // If locales use different paths, you can
    // specify the relevant external pathnames
    "/select-location": {
      fr: "/leistungen",
    },
    "/saves": {
      fr: "/leistungen",
    },

    // Dynamic params are supported via square brackets
    "/users/[username]": {
      fr: "/neuigkeiten/[username]",
    },
    "/posts/[post]": {
      fr: "/neuigkeiten/[post]",
    },
  },
});
