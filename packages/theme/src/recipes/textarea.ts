import { defineRecipe } from "@chakra-ui/react";
import { mobileFieldFontSize } from "./mobile-field-font";

export const textareaRecipe = defineRecipe({
  base: {
    ...mobileFieldFontSize,
    borderColor: "field.border",
    borderRadius: "md",
    _focus: {
      borderColor: "field.borderFocus",
      boxShadow: "0 0 0 1px {colors.primary.300}",
    },
  },
});
