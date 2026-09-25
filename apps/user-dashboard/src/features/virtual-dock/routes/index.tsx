import type { RouteObject } from "react-router-dom";
import { lazyImport } from "@/utils/lazy-import";
import { RouteConstants } from "@/shared/constants/routes";

const { VirtualDockPage } = lazyImport(
  () => import("../pages/VirtualDockPage"),
  "VirtualDockPage",
);
const { CourtroomDockPage } = lazyImport(
  () => import("../pages/CourtroomDockPage"),
  "CourtroomDockPage",
);
const { RemoteDatePage } = lazyImport(
  () => import("../pages/RemoteDatePage"),
  "RemoteDatePage",
);

export const VirtualDockRouteList: RouteObject[] = [
  { path: RouteConstants.dock.base.path, element: <VirtualDockPage /> },
  { path: RouteConstants.dock.courtroom.path, element: <CourtroomDockPage /> },
  { path: RouteConstants.dock.remoteDate.path, element: <RemoteDatePage /> },
];
