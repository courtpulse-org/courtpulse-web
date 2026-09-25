import { defineTokens } from "@chakra-ui/react";

/**
 * "Bench & Pulse" palette.
 *
 * Navy carries authority (the bench, the bar, official notices); brass is the
 * seal/gavel accent reserved for rewards and emphasis; the four court-status
 * hues are deliberately far apart so a lawyer glancing at a phone in sunlight
 * can tell "Not Sitting" from "In Recess" without reading the label.
 */
export const colors = defineTokens.colors({
  transparent: { value: "transparent" },
  current: { value: "currentColor" },
  black: { value: "#0B0F17" },
  white: { value: "#FFFFFF" },
  // Page background — a hair off white so white cards lift from it.
  surface: { value: "#F6F7FA" },

  // Brand primary — Judicial Navy
  primary: {
    25: { value: "#F2F5FA" },
    50: { value: "#E3E9F3" },
    75: { value: "#BFCBE0" },
    100: { value: "#91A5C7" },
    200: { value: "#5C78A6" },
    300: { value: "#1F3A66" }, // main
    400: { value: "#172D50" },
    500: { value: "#10203A" },
  },

  // Brand secondary — Brass (gavel / seal)
  secondary: {
    25: { value: "#FDF9EE" },
    50: { value: "#FBF3DF" },
    75: { value: "#F1DFAE" },
    100: { value: "#E5C878" },
    200: { value: "#D2AB46" },
    300: { value: "#B8892B" }, // main
    400: { value: "#8F6A21" },
    500: { value: "#664B17" },
  },

  // Neutrals — Paper to Ink (cool)
  gray: {
    25: { value: "#FAFBFC" },
    50: { value: "#F3F5F8" },
    75: { value: "#E6EAF0" },
    100: { value: "#C3CAD5" },
    200: { value: "#8A94A6" },
    300: { value: "#5B6577" },
    400: { value: "#333B4A" }, // Ink soft
    500: { value: "#161B26" }, // Ink
  },

  // Status — Success / "Judge on Bench" (emerald)
  success: {
    50: { value: "#E4F5EC" },
    75: { value: "#B9E4CC" },
    100: { value: "#86CFA8" },
    200: { value: "#48AE7E" },
    300: { value: "#1E8E5A" }, // main
    400: { value: "#176F46" },
    500: { value: "#105033" },
  },
  // Status — Warning / "Sitting Late" (amber)
  warning: {
    50: { value: "#FDF3E1" },
    100: { value: "#F9E0B0" },
    200: { value: "#F2C877" },
    300: { value: "#E5A83D" },
    400: { value: "#D8921C" },
    500: { value: "#C77D0A" }, // main
    600: { value: "#A26509" },
    700: { value: "#7E4E07" },
    800: { value: "#5A3805" },
    900: { value: "#3A2403" },
  },
  // Status — Error / "Court Not Sitting" (red)
  error: {
    50: { value: "#FBE7E4" },
    75: { value: "#F2BDB6" },
    100: { value: "#E79389" },
    200: { value: "#D3604F" },
    300: { value: "#B9382B" }, // main
    400: { value: "#922B21" },
    500: { value: "#6B1F18" },
  },
  // Status — Info / "Court in Recess" (blue)
  info: {
    50: { value: "#E8F0FA" },
    100: { value: "#C4D8F0" },
    200: { value: "#9BBDE4" },
    300: { value: "#6A9BD3" },
    400: { value: "#4783C3" },
    500: { value: "#2F6FB5" }, // main
    600: { value: "#265B94" },
    700: { value: "#1E4773" },
    800: { value: "#163352" },
    900: { value: "#0E2033" },
  },
});
