import type { RouteObject } from "react-router-dom";
import { lazyImport } from "@/utils/lazy-import";

const { TodayPage } = lazyImport(
  () => import("../pages/TodayPage"),
  "TodayPage",
);

export const TodayRouteList: RouteObject[] = [
  { index: true, element: <TodayPage /> },
];
