import { Outlet, type RouteObject } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { RouteError } from "@/components/error/RouteError";
import { OverviewRouteList } from "@/features/overview/routes";
import { WatchlistRouteList } from "@/features/watchlist/routes";
import { CauseListRouteList } from "@/features/cause-list/routes";
import { PulseRouteList } from "@/features/pulse/routes";
import { BriefHoldingRouteList } from "@/features/brief-holding/routes";
import { VirtualDockRouteList } from "@/features/virtual-dock/routes";
import { WalletRouteList } from "@/features/wallet/routes";
import { NotificationsRouteList } from "@/features/notifications/routes";
import { SettingsRouteList } from "@/features/settings/routes";

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
    ...OverviewRouteList,
    ...WatchlistRouteList,
    ...CauseListRouteList,
    ...PulseRouteList,
    ...BriefHoldingRouteList,
    ...VirtualDockRouteList,
    ...WalletRouteList,
    ...NotificationsRouteList,
    ...SettingsRouteList,
  ],
};
