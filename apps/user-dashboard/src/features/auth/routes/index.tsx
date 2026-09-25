import type { RouteObject } from "react-router-dom";
import { lazyImport } from "@/utils/lazy-import";
import { RouteConstants } from "@/shared/constants/routes";

const { LoginPage } = lazyImport(
  () => import("../pages/LoginPage"),
  "LoginPage",
);
const { VerifyOtpPage } = lazyImport(
  () => import("../pages/VerifyOtpPage"),
  "VerifyOtpPage",
);
const { SignupPage } = lazyImport(
  () => import("../pages/SignupPage"),
  "SignupPage",
);

export const AuthRouteList: RouteObject[] = [
  { path: RouteConstants.auth.login.path, element: <LoginPage /> },
  { path: RouteConstants.auth.verifyOtp.path, element: <VerifyOtpPage /> },
  { path: RouteConstants.auth.signup.path, element: <SignupPage /> },
];
