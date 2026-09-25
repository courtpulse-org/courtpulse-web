import type { RouteObject } from "react-router-dom";
import { lazyImport } from "@/utils/lazy-import";
import { RouteConstants } from "@/shared/constants/routes";

const { CauseListUploadPage } = lazyImport(
  () => import("../pages/CauseListUploadPage"),
  "CauseListUploadPage",
);

export const CauseListRouteList: RouteObject[] = [
  {
    path: RouteConstants.causeList.base.path,
    element: <CauseListUploadPage />,
  },
];
