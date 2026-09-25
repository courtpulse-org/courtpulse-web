import type { RouteObject } from "react-router-dom";
import { lazyImport } from "@/utils/lazy-import";
import { RouteConstants } from "@/shared/constants/routes";

const { CauseListPage } = lazyImport(
  () => import("../pages/CauseListPage"),
  "CauseListPage",
);
const { ScanPage } = lazyImport(() => import("../pages/ScanPage"), "ScanPage");
const { ScanResultPage } = lazyImport(
  () => import("../pages/ScanResultPage"),
  "ScanResultPage",
);

export const CauseListRouteList: RouteObject[] = [
  { path: RouteConstants.causeList.base.path, element: <CauseListPage /> },
  { path: RouteConstants.causeList.scan.path, element: <ScanPage /> },
  {
    path: RouteConstants.causeList.scanResult.path,
    element: <ScanResultPage />,
  },
];
