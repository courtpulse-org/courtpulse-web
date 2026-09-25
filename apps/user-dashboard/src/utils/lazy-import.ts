import * as React from "react";
import { isChunkLoadError, reloadForNewDeploy } from "./chunk-reload";

/** `const { Page } = lazyImport(() => import("./Page"), "Page")` */
export function lazyImport<
  T extends React.ComponentType<any>,
  I extends { [K2 in K]: T },
  K extends keyof I,
>(factory: () => Promise<I>, name: K): I {
  return Object.create({
    [name]: React.lazy(() =>
      factory()
        .catch((error) => {
          if (!isChunkLoadError(error) || !reloadForNewDeploy()) throw error;
          // A reload is in flight; keep showing the Suspense fallback.
          return new Promise<I>(() => {});
        })
        .then((module) => ({ default: module[name] })),
    ),
  });
}
