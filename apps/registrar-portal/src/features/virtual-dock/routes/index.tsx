import type { RouteObject } from "react-router-dom";
import { lazyImport } from "@/utils/lazy-import";
import { RouteConstants } from "@/shared/constants/routes";

const { DockIndexPage } = lazyImport(
  () => import("../pages/DockIndexPage"),
  "DockIndexPage",
);
const { DockControlPage } = lazyImport(
  () => import("../pages/DockControlPage"),
  "DockControlPage",
);
const { RemoteDatesPage } = lazyImport(
  () => import("../pages/RemoteDatesPage"),
  "RemoteDatesPage",
);

export const DockRouteList: RouteObject[] = [
  { path: RouteConstants.dock.base.path, element: <DockIndexPage /> },
  { path: RouteConstants.dock.courtroom.path, element: <DockControlPage /> },
  { path: RouteConstants.dock.remoteDates.path, element: <RemoteDatesPage /> },
];
