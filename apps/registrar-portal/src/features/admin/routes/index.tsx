import { Navigate, type RouteObject } from "react-router-dom";
import { lazyImport } from "@/utils/lazy-import";
import { RouteConstants } from "@/shared/constants/routes";

const { RegistrarsPage } = lazyImport(
  () => import("../pages/RegistrarsPage"),
  "RegistrarsPage",
);
const { LawyersPage } = lazyImport(
  () => import("../pages/LawyersPage"),
  "LawyersPage",
);
const { DisputesPage } = lazyImport(
  () => import("../pages/DisputesPage"),
  "DisputesPage",
);
const { EscrowPage } = lazyImport(
  () => import("../pages/EscrowPage"),
  "EscrowPage",
);
const { ConsensusPage } = lazyImport(
  () => import("../pages/ConsensusPage"),
  "ConsensusPage",
);

export const AdminRouteList: RouteObject[] = [
  {
    path: RouteConstants.admin.base.path,
    element: <Navigate to={RouteConstants.admin.registrars.path} replace />,
  },
  { path: RouteConstants.admin.registrars.path, element: <RegistrarsPage /> },
  { path: RouteConstants.admin.lawyers.path, element: <LawyersPage /> },
  { path: RouteConstants.admin.disputes.path, element: <DisputesPage /> },
  { path: RouteConstants.admin.escrow.path, element: <EscrowPage /> },
  { path: RouteConstants.admin.consensus.path, element: <ConsensusPage /> },
];
