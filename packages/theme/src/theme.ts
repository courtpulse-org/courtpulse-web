import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import {
  colors,
  fonts,
  fontSizes,
  fontWeights,
  shadows,
  radii,
} from "./tokens";
import { semanticColors } from "./semantic-tokens";
import { textStyles } from "./text-styles";
import { globalCss } from "./global-css";
import {
  buttonRecipe,
  inputRecipe,
  skeletonRecipe,
  textareaRecipe,
  nativeSelectRecipe,
} from "./recipes";

const config = defineConfig({
  cssVarsPrefix: "courtpulse",
  globalCss,
  theme: {
    tokens: {
      colors,
      fonts,
      fontSizes,
      fontWeights,
      shadows,
      radii,
    },
    semanticTokens: {
      colors: semanticColors,
    },
    textStyles,
    recipes: {
      button: buttonRecipe,
      input: inputRecipe,
      skeleton: skeletonRecipe,
      textarea: textareaRecipe,
    },
    slotRecipes: {
      nativeSelect: nativeSelectRecipe,
    },
    keyframes: {
      // The live "pulse" ring on a verified courtroom status.
      pulseRing: {
        "0%": { transform: "scale(0.9)", opacity: "0.8" },
        "70%": { transform: "scale(1.6)", opacity: "0" },
        "100%": { transform: "scale(1.6)", opacity: "0" },
      },
      scaleUp: {
        "0%": { transform: "scale(0.3)", opacity: "0" },
        "100%": { transform: "scale(1)", opacity: "1" },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
