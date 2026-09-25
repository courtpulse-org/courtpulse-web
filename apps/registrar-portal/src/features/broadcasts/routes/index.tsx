import type { RouteObject } from "react-router-dom";
import { lazyImport } from "@/utils/lazy-import";
import { RouteConstants } from "@/shared/constants/routes";

const { BroadcastsPage } = lazyImport(
  () => import("../pages/BroadcastsPage"),
  "BroadcastsPage",
);

export const BroadcastRouteList: RouteObject[] = [
  { path: RouteConstants.broadcasts.base.path, element: <BroadcastsPage /> },
];
