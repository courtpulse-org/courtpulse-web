// iOS Safari zooms the whole page when a focused field's font-size is under
// 16px, so every text field renders at 1rem below the `md` breakpoint. Recipe
// styles live in the low-priority `recipes` cascade layer, so a `fontSize`
// prop on the component still wins.
export const mobileFieldFontSize = {
  mdDown: {
    fontSize: "1rem",
    _placeholder: {
      fontSize: "1rem",
    },
  },
} as const;
