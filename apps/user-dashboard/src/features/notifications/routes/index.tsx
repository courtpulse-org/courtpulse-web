import type { RouteObject } from "react-router-dom";
import { lazyImport } from "@/utils/lazy-import";
import { RouteConstants } from "@/shared/constants/routes";

const { NotificationsPage } = lazyImport(
  () => import("../pages/NotificationsPage"),
  "NotificationsPage",
);

export const NotificationsRouteList: RouteObject[] = [
  {
    path: RouteConstants.notifications.base.path,
    element: <NotificationsPage />,
  },
];
