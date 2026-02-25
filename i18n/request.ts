import { getUserLocale } from "@/i18n/locale";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.

  // const cookieStore = cookies();
  // const locale = (await cookieStore).get("locale")?.value || "en";

  const locale = await getUserLocale();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
