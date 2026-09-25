import type { RouteObject } from "react-router-dom";
import { lazyImport } from "@/utils/lazy-import";
import { RouteConstants } from "@/shared/constants/routes";

const { MarketplacePage } = lazyImport(
  () => import("../pages/MarketplacePage"),
  "MarketplacePage",
);
const { MyBriefsPage } = lazyImport(
  () => import("../pages/MyBriefsPage"),
  "MyBriefsPage",
);
const { NewRequestPage } = lazyImport(
  () => import("../pages/NewRequestPage"),
  "NewRequestPage",
);
const { BriefDetailsPage } = lazyImport(
  () => import("../pages/BriefDetailsPage"),
  "BriefDetailsPage",
);

// Static "/briefs/new" and "/briefs/mine" are declared before "/:id" so they
// never get captured as an id (react-router ranks static over dynamic anyway).
export const BriefHoldingRouteList: RouteObject[] = [
  { path: RouteConstants.briefs.base.path, element: <MarketplacePage /> },
  { path: RouteConstants.briefs.new.path, element: <NewRequestPage /> },
  { path: RouteConstants.briefs.mine.path, element: <MyBriefsPage /> },
  { path: RouteConstants.briefs.details.path, element: <BriefDetailsPage /> },
];
