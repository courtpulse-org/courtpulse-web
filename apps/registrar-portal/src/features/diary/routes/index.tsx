import type { RouteObject } from "react-router-dom";
import { lazyImport } from "@/utils/lazy-import";
import { RouteConstants } from "@/shared/constants/routes";

const { DiaryPage } = lazyImport(
  () => import("../pages/DiaryPage"),
  "DiaryPage",
);

export const DiaryRouteList: RouteObject[] = [
  { path: RouteConstants.diary.base.path, element: <DiaryPage /> },
];
