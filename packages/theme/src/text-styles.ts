import { defineTextStyles } from "@chakra-ui/react";

// Heading sizes — map to tokens/fonts.ts fontSizes.
const H1_SIZE = "3xl";
const H2_SIZE = "2xl";
const H3_SIZE = "xl";
const H4_SIZE = "md";
const H5_SIZE = "sm";

const LH_TIGHT = "1.1";
const LH_SNUG = "1.25";
const LH_BODY = "1.5";
const TRACK_TIGHT = "-0.02em";

const serifHeading = (fontSize: string, lineHeight: string) => ({
  fontFamily: "serif",
  fontWeight: "medium",
  fontSize,
  lineHeight,
  letterSpacing: TRACK_TIGHT,
});

const sansHeading = (fontSize: string) => ({
  fontFamily: "sans",
  fontWeight: "semibold",
  fontSize,
  lineHeight: LH_SNUG,
});

const body = (fontSize: string, lineHeight: string, fontWeight: string) => ({
  fontFamily: "sans",
  fontSize,
  lineHeight,
  fontWeight,
});

export const textStyles = defineTextStyles({
  body: {
    description: "Default body text",
    value: body("md", LH_BODY, "normal"),
  },

  // Headings — h1/h2/h3 serif (Fraunces), h4/h5 sans (Inter)
  h1: { value: serifHeading(H1_SIZE, LH_TIGHT) },
  h2: { value: serifHeading(H2_SIZE, LH_TIGHT) },
  h3: { value: serifHeading(H3_SIZE, LH_SNUG) },
  h4: { value: sansHeading(H4_SIZE) },
  h5: { value: sansHeading(H5_SIZE) },

  // Body sizes
  "large-regular": { value: body("1.25rem", "1.875rem", "normal") },
  "large-semibold": { value: body("1.25rem", "1.875rem", "semibold") },
  "default-regular": { value: body("1rem", "1.5rem", "normal") },
  "default-medium": { value: body("1rem", "1.5rem", "medium") },
  "default-semibold": { value: body("1rem", "1.5rem", "semibold") },
  "small-regular": { value: body("0.875rem", "1.375rem", "normal") },
  "small-medium": { value: body("0.875rem", "1.375rem", "medium") },
  "small-semibold": { value: body("0.875rem", "1.375rem", "semibold") },
  "tiny-regular": { value: body("0.75rem", "1.25rem", "normal") },
  "tiny-medium": { value: body("0.75rem", "1.25rem", "medium") },
  "tiny-semibold": { value: body("0.75rem", "1.25rem", "semibold") },

  // Suit numbers, item numbers, OTP digits — tabular, monospaced.
  mono: {
    value: {
      fontFamily: "mono",
      fontSize: "0.875rem",
      lineHeight: "1.375rem",
      fontWeight: "medium",
      fontVariantNumeric: "tabular-nums",
    },
  },
});
