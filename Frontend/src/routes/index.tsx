import privateRoutes from "./private";
import publicRoutes from "./public";

export type RouteType = {
  path: string;
  element: JSX.Element;
  permission?: string;
  children?: {
    path?: string;
    element: JSX.Element;
    permission?: string;
    index?: boolean;
  }[];
}[];

export { privateRoutes, publicRoutes };
