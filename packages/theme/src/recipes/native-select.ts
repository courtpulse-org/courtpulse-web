import { defineSlotRecipe } from "@chakra-ui/react";
import { mobileFieldFontSize } from "./mobile-field-font";

export const nativeSelectRecipe = defineSlotRecipe({
  slots: ["root", "field", "indicator"],
  base: {
    field: {
      ...mobileFieldFontSize,
      borderColor: "field.border",
      borderRadius: "md",
    },
  },
});
