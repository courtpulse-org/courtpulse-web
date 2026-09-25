import type { RouteObject } from "react-router-dom";
import { lazyImport } from "@/utils/lazy-import";
import { RouteConstants } from "@/shared/constants/routes";

const { AdminOverviewPage } = lazyImport(
  () => import("../pages/AdminOverviewPage"),
  "AdminOverviewPage",
);
const { RegistrarsPage } = lazyImport(
  () => import("../pages/RegistrarsPage"),
  "RegistrarsPage",
);
const { CourtsPage } = lazyImport(
  () => import("../pages/CourtsPage"),
  "CourtsPage",
);
const { CalendarPage } = lazyImport(
  () => import("../pages/CalendarPage"),
  "CalendarPage",
);
const { LawyersPage } = lazyImport(
  () => import("../pages/LawyersPage"),
  "LawyersPage",
);
const { ConsensusPage } = lazyImport(
  () => import("../pages/ConsensusPage"),
  "ConsensusPage",
);

export const AdminRouteList: RouteObject[] = [
  { path: RouteConstants.admin.base.path, element: <AdminOverviewPage /> },
  { path: RouteConstants.admin.registrars.path, element: <RegistrarsPage /> },
  { path: RouteConstants.admin.courts.path, element: <CourtsPage /> },
  { path: RouteConstants.admin.calendar.path, element: <CalendarPage /> },
  { path: RouteConstants.admin.lawyers.path, element: <LawyersPage /> },
  { path: RouteConstants.admin.consensus.path, element: <ConsensusPage /> },
];
