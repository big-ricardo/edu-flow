import privateRoutes from "./private";
import publicRoutes from "./public";

export type RouteType = {
  path: string;
  element: JSX.Element;
  children?: {
    path?: string;
    element: JSX.Element;
    index?: boolean;
  }[];
}[];

export { privateRoutes, publicRoutes };
