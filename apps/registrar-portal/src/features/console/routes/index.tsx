import type { RouteObject } from "react-router-dom";
import { lazyImport } from "@/utils/lazy-import";

const { ConsolePage } = lazyImport(
  () => import("../pages/ConsolePage"),
  "ConsolePage",
);

export const ConsoleRouteList: RouteObject[] = [
  { index: true, element: <ConsolePage /> },
];
