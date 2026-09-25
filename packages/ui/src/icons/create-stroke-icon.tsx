import { createIcon } from "@chakra-ui/react";

/**
 * 24×24 stroke icon factory (Lucide/Feather geometry). Every icon inherits
 * `currentColor`, so a sidebar item recolours it by setting `color`.
 */
export function createStrokeIcon(displayName: string, d: string | string[]) {
  const paths = Array.isArray(d) ? d : [d];
  return createIcon({
    displayName,
    viewBox: "0 0 24 24",
    path: (
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {paths.map((p, i) => (
          <path key={i} d={p} />
        ))}
      </g>
    ),
  });
}
