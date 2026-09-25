import { defineGlobalStyles } from "@chakra-ui/react";

export const globalCss = defineGlobalStyles({
  "html, body": {
    margin: 0,
    padding: 0,
    fontFamily: "sans",
    fontSize: "md",
    lineHeight: "1.5",
    textRendering: "optimizeLegibility",
    color: "{colors.gray.500}",
    background: "{colors.surface}",
    scrollBehavior: "smooth",
    overscrollBehaviorY: "none",
  },
  "#root": {
    minHeight: "100dvh",
  },
});
