import { Outlet, type RouteObject } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { RouteError } from "@/components/error/RouteError";
import { ConsoleRouteList } from "@/features/console/routes";
import { BroadcastRouteList } from "@/features/broadcasts/routes";
import { DockRouteList } from "@/features/virtual-dock/routes";
import { CauseListRouteList } from "@/features/cause-list/routes";
import { AdminRouteList } from "@/features/admin/routes";
import { SettingsRouteList } from "@/features/settings/routes";
import RequireAdmin from "./RequireAdmin";

const DashboardOutlet = (
  <AppLayout>
    <Outlet />
  </AppLayout>
);

export const DashboardRoutes: RouteObject = {
  path: "/",
  element: DashboardOutlet,
  errorElement: <RouteError />,
  children: [
    ...ConsoleRouteList,
    ...BroadcastRouteList,
    ...DockRouteList,
    ...CauseListRouteList,
    ...SettingsRouteList,
    { element: <RequireAdmin />, children: AdminRouteList },
  ],
};
