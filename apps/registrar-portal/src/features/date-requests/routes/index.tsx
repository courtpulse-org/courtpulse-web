import type { RouteObject } from "react-router-dom";
import { lazyImport } from "@/utils/lazy-import";
import { RouteConstants } from "@/shared/constants/routes";

const { DateRequestsPage } = lazyImport(
  () => import("../pages/DateRequestsPage"),
  "DateRequestsPage",
);

export const DateRequestRouteList: RouteObject[] = [
  {
    path: RouteConstants.dateRequests.base.path,
    element: <DateRequestsPage />,
  },
];
