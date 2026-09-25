import type { RouteObject } from "react-router-dom";
import { lazyImport } from "@/utils/lazy-import";
import { RouteConstants } from "@/shared/constants/routes";

const { PulsePage } = lazyImport(
  () => import("../pages/PulsePage"),
  "PulsePage",
);
const { CourtroomPage } = lazyImport(
  () => import("../pages/CourtroomPage"),
  "CourtroomPage",
);

export const PulseRouteList: RouteObject[] = [
  { path: RouteConstants.pulse.base.path, element: <PulsePage /> },
  { path: RouteConstants.pulse.courtroom.path, element: <CourtroomPage /> },
];
