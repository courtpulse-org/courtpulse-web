import { defineRecipe } from "@chakra-ui/react";

const noFocusOutline = {
  outline: "none",
  outlineColor: "unset",
  outlineOffset: "0",
};

export const buttonRecipe = defineRecipe({
  base: {
    borderRadius: "md",
    fontSize: "0.875rem",
    fontWeight: "500",
    lineHeight: "1.25rem",
    cursor: "pointer",
    transition: "all 0.15s ease-in-out",
    _disabled: {
      opacity: 0.65,
      cursor: "not-allowed",
    },
  },
  variants: {
    variant: {
      primary: {
        bg: "primary.300",
        border: "none",
        color: "white",
        _hover: { bg: "primary.400" },
        _focus: { bg: "primary.400", ...noFocusOutline },
        _disabled: { bg: "gray.100", color: "gray.300" },
      },
      secondary: {
        bg: "secondary.300",
        color: "white",
        border: "none",
        _hover: { bg: "secondary.400" },
        _focus: { bg: "secondary.400", ...noFocusOutline },
        _disabled: { bg: "gray.100", color: "gray.300" },
      },
      outline: {
        bg: "transparent",
        color: "primary.300",
        border: "1px solid",
        borderColor: "primary.300",
        _hover: { bg: "primary.25" },
        _focus: { bg: "primary.25", ...noFocusOutline },
        _disabled: {
          bg: "transparent",
          color: "gray.300",
          borderColor: "gray.75",
        },
      },
      outlineSecondary: {
        bg: "white",
        color: "gray.300",
        border: "1px solid",
        borderColor: "gray.75",
        _hover: { bg: "gray.50", borderColor: "gray.100" },
        _focus: noFocusOutline,
        _disabled: {
          bg: "transparent",
          color: "gray.300",
          borderColor: "gray.75",
        },
      },
      ghost: {
        bg: "transparent",
        color: "primary.300",
        border: "none",
        _hover: { bg: "primary.25" },
        _focus: { bg: "primary.25" },
        _disabled: { bg: "transparent", color: "gray.300" },
      },
      danger: {
        bg: "error.300",
        color: "white",
        border: "none",
        _hover: { bg: "error.400" },
        _focus: { bg: "error.400", ...noFocusOutline },
        _disabled: { bg: "gray.100", color: "gray.300" },
      },
      dangerOutline: {
        bg: "transparent",
        color: "error.300",
        border: "1px solid",
        borderColor: "error.300",
        _hover: { bg: "error.50" },
        _focus: { bg: "error.50", ...noFocusOutline },
        _disabled: {
          bg: "transparent",
          color: "gray.300",
          borderColor: "gray.75",
        },
      },
      // The 1-tap status buttons: tinted by `colorPalette`, so a Spotter's
      // four choices read as four distinct colours at arm's length.
      status: {
        bg: "colorPalette.subtle",
        color: "colorPalette.fg",
        border: "1px solid",
        borderColor: "colorPalette.muted",
        fontWeight: "600",
        _hover: { bg: "colorPalette.muted" },
        _focus: { bg: "colorPalette.muted", ...noFocusOutline },
        _active: { bg: "colorPalette.solid", color: "colorPalette.contrast" },
        _disabled: { bg: "gray.50", color: "gray.300", borderColor: "gray.75" },
      },
    },
    size: {
      sm: { h: "2rem", px: "0.75rem", fontSize: "0.8125rem" },
      md: { h: "2.5rem", px: "1rem", fontSize: "0.875rem" },
      lg: { h: "3rem", px: "1.5rem", fontSize: "1rem" },
      // Thumb-sized: the check-in and status buttons on a phone.
      xl: { h: "3.5rem", px: "1.5rem", fontSize: "1.0625rem" },
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});
