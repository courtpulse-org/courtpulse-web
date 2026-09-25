import { defineRecipe } from "@chakra-ui/react";

export const skeletonRecipe = defineRecipe({
  variants: {
    variant: {
      pulse: {
        background: "gray.75",
        animationDuration: "var(--duration, 1.4s)",
      },
      shine: {
        "--start-color": "{colors.gray.75}",
        "--end-color": "{colors.gray.100}",
      },
    },
  },
});
