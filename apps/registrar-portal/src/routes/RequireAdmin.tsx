import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "@/hooks";
import { RouteConstants } from "@/shared/constants/routes";

/** Admin-only section. The API enforces this too; this only hides the UI. */
export default function RequireAdmin() {
  const { isAdmin } = useCurrentUser();
  if (!isAdmin) return <Navigate to={RouteConstants.today.base.path} replace />;
  return <Outlet />;
}
