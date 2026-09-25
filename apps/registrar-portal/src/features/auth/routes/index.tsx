import type { RouteObject } from "react-router-dom";
import { lazyImport } from "@/utils/lazy-import";
import { RouteConstants } from "@/shared/constants/routes";

const { LoginPage } = lazyImport(
  () => import("../pages/LoginPage"),
  "LoginPage",
);
const { AcceptInvitePage } = lazyImport(
  () => import("../pages/AcceptInvitePage"),
  "AcceptInvitePage",
);

export const AuthRouteList: RouteObject[] = [
  { path: RouteConstants.auth.login.path, element: <LoginPage /> },
  {
    path: RouteConstants.auth.acceptInvite.path,
    element: <AcceptInvitePage />,
  },
];
