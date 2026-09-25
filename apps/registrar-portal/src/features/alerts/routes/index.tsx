import type { RouteObject } from "react-router-dom";
import { lazyImport } from "@/utils/lazy-import";
import { RouteConstants } from "@/shared/constants/routes";

const { AlertLogPage } = lazyImport(
  () => import("../pages/AlertLogPage"),
  "AlertLogPage",
);

export const AlertRouteList: RouteObject[] = [
  { path: RouteConstants.alerts.base.path, element: <AlertLogPage /> },
];
