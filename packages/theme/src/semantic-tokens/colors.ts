import { defineSemanticTokens } from "@chakra-ui/react";

/** Chakra colorPalette for each court status. */
export const COURT_STATUS_COLOR = {
  SITTING: "primary",
  ON_BENCH: "success",
  SITTING_LATE: "warning",
  IN_RECESS: "info",
  ROSE: "gray",
  NOT_SITTING: "error",
} as const;

/** Chakra colorPalette for each cause-list outcome. */
export const OUTCOME_COLOR = {
  PENDING: "gray",
  CALLED: "success",
  STOOD_DOWN: "warning",
  HEARD: "primary",
  ADJOURNED: "info",
  RESERVED: "secondary",
  STRUCK_OUT: "error",
} as const;

/** Chakra colorPalette for each consensus level. */
export const VERIFICATION_COLOR = {
  UNVERIFIED: "gray",
  VERIFIED: "success",
  OFFICIAL: "primary",
} as const;

export const semanticColors = defineSemanticTokens.colors({
  primary: {
    solid: { value: "{colors.primary.300}" },
    contrast: { value: "{colors.white}" },
    fg: { value: "{colors.primary.400}" },
    muted: { value: "{colors.primary.75}" },
    subtle: { value: "{colors.primary.50}" },
    emphasized: { value: "{colors.primary.200}" },
    focusRing: { value: "{colors.primary.300}" },
  },
  secondary: {
    solid: { value: "{colors.secondary.300}" },
    contrast: { value: "{colors.white}" },
    fg: { value: "{colors.secondary.400}" },
    muted: { value: "{colors.secondary.75}" },
    subtle: { value: "{colors.secondary.50}" },
    emphasized: { value: "{colors.secondary.200}" },
    focusRing: { value: "{colors.secondary.300}" },
  },
  error: {
    solid: { value: "{colors.error.300}" },
    contrast: { value: "{colors.white}" },
    fg: { value: "{colors.error.400}" },
    muted: { value: "{colors.error.75}" },
    subtle: { value: "{colors.error.50}" },
    emphasized: { value: "{colors.error.200}" },
    focusRing: { value: "{colors.error.300}" },
  },
  success: {
    solid: { value: "{colors.success.300}" },
    contrast: { value: "{colors.white}" },
    fg: { value: "{colors.success.400}" },
    muted: { value: "{colors.success.75}" },
    subtle: { value: "{colors.success.50}" },
    emphasized: { value: "{colors.success.200}" },
    focusRing: { value: "{colors.success.300}" },
  },
  warning: {
    solid: { value: "{colors.warning.500}" },
    contrast: { value: "{colors.white}" },
    fg: { value: "{colors.warning.700}" },
    muted: { value: "{colors.warning.200}" },
    subtle: { value: "{colors.warning.50}" },
    emphasized: { value: "{colors.warning.300}" },
    focusRing: { value: "{colors.warning.500}" },
  },
  info: {
    solid: { value: "{colors.info.500}" },
    contrast: { value: "{colors.white}" },
    fg: { value: "{colors.info.700}" },
    muted: { value: "{colors.info.200}" },
    subtle: { value: "{colors.info.50}" },
    emphasized: { value: "{colors.info.300}" },
    focusRing: { value: "{colors.info.500}" },
  },
  gray: {
    solid: { value: "{colors.gray.300}" },
    contrast: { value: "{colors.white}" },
    fg: { value: "{colors.gray.400}" },
    muted: { value: "{colors.gray.75}" },
    subtle: { value: "{colors.gray.50}" },
    emphasized: { value: "{colors.gray.100}" },
    focusRing: { value: "{colors.gray.300}" },
  },

  // Court status — named so a screen can say `bg="court.sitting.subtle"`
  // without knowing which base palette that maps to.
  court: {
    sitting: {
      solid: { value: "{colors.success.300}" },
      fg: { value: "{colors.success.400}" },
      subtle: { value: "{colors.success.50}" },
    },
    late: {
      solid: { value: "{colors.warning.500}" },
      fg: { value: "{colors.warning.700}" },
      subtle: { value: "{colors.warning.50}" },
    },
    notSitting: {
      solid: { value: "{colors.error.300}" },
      fg: { value: "{colors.error.400}" },
      subtle: { value: "{colors.error.50}" },
    },
    recess: {
      solid: { value: "{colors.info.500}" },
      fg: { value: "{colors.info.700}" },
      subtle: { value: "{colors.info.50}" },
    },
  },

  // Form fields
  field: {
    border: { value: "{colors.gray.75}" },
    borderFocus: { value: "{colors.primary.300}" },
    borderError: { value: "{colors.error.300}" },
    bg: { value: "{colors.white}" },
    bgDisabled: { value: "{colors.gray.50}" },
    placeholder: { value: "{colors.gray.100}" },
    text: { value: "{colors.gray.400}" },
    label: { value: "{colors.gray.300}" },
    required: { value: "{colors.error.300}" },
    errorText: { value: "{colors.error.300}" },
  },
});
