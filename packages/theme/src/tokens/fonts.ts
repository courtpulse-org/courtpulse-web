import { defineTokens } from "@chakra-ui/react";

// Fraunces: a serif with real weight at display sizes and an optical-size axis
// so it stays crisp at 22px on a phone. Inter: the body face — its tall
// x-height reads best at 13–16px, which is where a cause-list row lives.
const SERIF = "'Fraunces', 'Iowan Old Style', Georgia, serif";
const SANS = "'Inter', -apple-system, 'Helvetica Neue', system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace";

export const fonts = defineTokens.fonts({
  heading: { value: SERIF },
  body: { value: SANS },
  mono: { value: MONO },
  serif: { value: SERIF },
  sans: { value: SANS },
});

export const fontSizes = defineTokens.fontSizes({
  xs: { value: "0.6875rem" }, // 11px
  sm: { value: "0.8125rem" }, // 13px
  md: { value: "1rem" }, // 16px
  lg: { value: "1.0625rem" }, // 17px
  xl: { value: "1.375rem" }, // 22px
  "2xl": { value: "1.625rem" }, // 26px
  "3xl": { value: "1.875rem" }, // 30px
  "4xl": { value: "2.125rem" }, // 34px
  "5xl": { value: "2.375rem" }, // 38px
  "6xl": { value: "3.125rem" }, // 50px
});

export const fontWeights = defineTokens.fontWeights({
  normal: { value: "400" },
  medium: { value: "500" },
  semibold: { value: "600" },
  bold: { value: "700" },
});
