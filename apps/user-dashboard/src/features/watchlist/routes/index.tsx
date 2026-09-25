import type { RouteObject } from "react-router-dom";
import { lazyImport } from "@/utils/lazy-import";
import { RouteConstants } from "@/shared/constants/routes";

const { WatchlistPage } = lazyImport(
  () => import("../pages/WatchlistPage"),
  "WatchlistPage",
);
const { AddCasePage } = lazyImport(
  () => import("../pages/AddCasePage"),
  "AddCasePage",
);
const { CaseDetailsPage } = lazyImport(
  () => import("../pages/CaseDetailsPage"),
  "CaseDetailsPage",
);

export const WatchlistRouteList: RouteObject[] = [
  { path: RouteConstants.watchlist.base.path, element: <WatchlistPage /> },
  { path: RouteConstants.watchlist.new.path, element: <AddCasePage /> },
  { path: RouteConstants.watchlist.details.path, element: <CaseDetailsPage /> },
];
