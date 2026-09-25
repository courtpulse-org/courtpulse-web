import type { RouteObject } from "react-router-dom";
import { lazyImport } from "@/utils/lazy-import";
import { RouteConstants } from "@/shared/constants/routes";

const { SettingsPage } = lazyImport(
  () => import("../pages/SettingsPage"),
  "SettingsPage",
);

export const SettingsRouteList: RouteObject[] = [
  { path: RouteConstants.settings.base.path, element: <SettingsPage /> },
];
