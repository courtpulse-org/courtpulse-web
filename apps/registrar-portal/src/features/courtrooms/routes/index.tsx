import type { RouteObject } from "react-router-dom";
import { lazyImport } from "@/utils/lazy-import";
import { RouteConstants } from "@/shared/constants/routes";

const { CourtroomsPage } = lazyImport(
  () => import("../pages/CourtroomsPage"),
  "CourtroomsPage",
);
const { CourtroomWorkspacePage } = lazyImport(
  () => import("../pages/CourtroomWorkspacePage"),
  "CourtroomWorkspacePage",
);

export const CourtroomRouteList: RouteObject[] = [
  { path: RouteConstants.courtrooms.base.path, element: <CourtroomsPage /> },
  {
    path: RouteConstants.courtrooms.details.path,
    element: <CourtroomWorkspacePage />,
  },
];
