import type { RouteObject } from "react-router-dom";
import { lazyImport } from "@/utils/lazy-import";
import { RouteConstants } from "@/shared/constants/routes";

const { WalletPage } = lazyImport(
  () => import("../pages/WalletPage"),
  "WalletPage",
);
const { CreditsPage } = lazyImport(
  () => import("../pages/CreditsPage"),
  "CreditsPage",
);
const { EscrowPage } = lazyImport(
  () => import("../pages/EscrowPage"),
  "EscrowPage",
);

export const WalletRouteList: RouteObject[] = [
  { path: RouteConstants.wallet.base.path, element: <WalletPage /> },
  { path: RouteConstants.wallet.credits.path, element: <CreditsPage /> },
  { path: RouteConstants.wallet.escrow.path, element: <EscrowPage /> },
];
