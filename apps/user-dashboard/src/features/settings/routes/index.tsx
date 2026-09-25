import { Navigate, type RouteObject } from "react-router-dom";
import { lazyImport } from "@/utils/lazy-import";
import { RouteConstants } from "@/shared/constants/routes";

const { SettingsProfilePage } = lazyImport(
  () => import("../pages/SettingsProfilePage"),
  "SettingsProfilePage",
);
const { SettingsNotificationsPage } = lazyImport(
  () => import("../pages/SettingsNotificationsPage"),
  "SettingsNotificationsPage",
);

export const SettingsRouteList: RouteObject[] = [
  {
    path: RouteConstants.settings.base.path,
    element: <Navigate to={RouteConstants.settings.profile.path} replace />,
  },
  {
    path: RouteConstants.settings.profile.path,
    element: <SettingsProfilePage />,
  },
  {
    path: RouteConstants.settings.notifications.path,
    element: <SettingsNotificationsPage />,
  },
];
