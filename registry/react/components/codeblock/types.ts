import {
  BundledLanguage,
  BundledTheme,
  SpecialLanguage,
  StringLiteralUnion,
  ThemeRegistrationAny,
} from "shiki";

/**
 * Props for the Shiki-powered {@link CodeBlock} component.
 */
export interface CodeBlockProps {
  /** The raw code string to display and highlight. */
  code: string;
  /**
   * A Shiki-supported language identifier used for syntax highlighting.
   * Full list: https://shiki.style/languages
   * @defaultValue `"tsx"`
   */
  language?: BundledLanguage | SpecialLanguage;
  /** Optional filename shown in the header bar above the code. */
  filename?: string;
  /**
   * A Shiki built-in theme name.
   * Full list: https://shiki.style/themes
   * @defaultValue `"github-dark"`
   */
  theme?: ThemeRegistrationAny | StringLiteralUnion<BundledTheme, string>;
  /**
   * A Shiki built-in theme name.
   * Full list: https://shiki.style/themes
   * @defaultValue dark: `"github-dark"`, light: `"github-light"`
   */
  themes?: Record<
    string,
    ThemeRegistrationAny | StringLiteralUnion<BundledTheme, string>
  >;
  /**
   * Whether to render line numbers in a gutter alongside each line.
   * @defaultValue `false`
   */
  showLineNumbers?: boolean;
  /**
   * Whether to the codeblock should be collapsible.
   * @defaultValue `false`
   */
  collapsible?: boolean;
}
