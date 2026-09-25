/* eslint-disable @typescript-eslint/no-unused-vars */
// Type-safe route constants factory for React Router.
// Each route carries:
// - `path`: the router path string (e.g. '/watchlist/:id')
// - `generate`: builds a URL from typed path params plus optional query params.

type PathParam<Path extends string> =
  Path extends `${infer _Prefix}/:${infer Param}/${infer Rest}`
    ? Param | PathParam<`/${Rest}`>
    : Path extends `${infer _Prefix}/:${infer Param}`
      ? Param
      : never;

type Params<Path extends string> = {
  [Key in PathParam<Path>]: string | number;
};

export interface Route<Path extends string> {
  path: Path;
  generate: (
    params: Params<Path>,
    query?: Record<string, string | number | boolean>,
  ) => string;
}

export function defineRoute<Path extends string>(path: Path): Route<Path> {
  return {
    path,
    generate: (params, query) => {
      let url = path.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
        if (!(key in params)) {
          throw new Error(
            `Missing required path parameter: ${key} for path "${path}"`,
          );
        }
        const value = params[key as keyof typeof params];
        if (value === undefined || value === null) {
          throw new Error(
            `Path parameter "${key}" cannot be undefined or null`,
          );
        }
        return encodeURIComponent(value.toString());
      });

      if (query && Object.keys(query).length > 0) {
        const searchParams = new URLSearchParams();
        for (const [k, v] of Object.entries(query)) {
          if (v !== undefined && v !== null)
            searchParams.append(k, v.toString());
        }
        if (searchParams.toString()) url += `?${searchParams.toString()}`;
      }

      return url;
    },
  };
}
