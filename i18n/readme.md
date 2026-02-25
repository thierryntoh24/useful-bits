# internationalisation
* Need the [framework](../.vscode/i18n-ally-custom-framework.yml) and [settings](../.vscode/settings.json) files from .vscode folder
* messages (`[locale].json` inside messages folder)
* Add to `next.config.js` 
```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/** Wrap Next.js config with next-intl plugin */
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  /* config options here */
};

/** Export intl config */
export default withNextIntl(nextConfig);
```
