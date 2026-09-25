import { Outlet, type RouteObject } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { RouteError } from "@/components/error/RouteError";
import { TodayRouteList } from "@/features/today/routes";
import { CourtroomRouteList } from "@/features/courtrooms/routes";
import { BroadcastRouteList } from "@/features/broadcasts/routes";
import { DateRequestRouteList } from "@/features/date-requests/routes";
import { DiaryRouteList } from "@/features/diary/routes";
import { AlertRouteList } from "@/features/alerts/routes";
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
    ...TodayRouteList,
    ...CourtroomRouteList,
    ...BroadcastRouteList,
    ...DateRequestRouteList,
    ...DiaryRouteList,
    ...AlertRouteList,
    ...SettingsRouteList,
    { element: <RequireAdmin />, children: AdminRouteList },
  ],
};
