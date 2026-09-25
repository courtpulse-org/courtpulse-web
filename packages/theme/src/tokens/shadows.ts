import { defineTokens } from "@chakra-ui/react";

// Elevation scale anchored on Ink (#161B26).
export const shadows = defineTokens.shadows({
  sm: { value: "0 1px 2px rgba(22, 27, 38, 0.05)" },
  md: { value: "0 4px 16px rgba(22, 27, 38, 0.08)" },
  lg: { value: "0 24px 64px rgba(22, 27, 38, 0.12)" },
});
