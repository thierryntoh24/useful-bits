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

## usage
* use the provider in `root layout`
```tsx
import {NextIntlClientProvider} from 'next-intl';
 
type Props = {
  children: React.ReactNode;
};
 
export default async function RootLayout({children}: Props) {
  return (
    <html>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

* consume with `useTranslations` hook in your component
```tsx
import {useTranslations} from 'next-intl';
 
export default function HomePage() {
  const t = useTranslations('HomePage');
  return <h1>{t('title')}</h1>;
}
```
