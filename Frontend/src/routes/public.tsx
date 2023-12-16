import { RouteType } from ".";

const routes: RouteType = [
  {
    path: "/",
    element: <h1>Public</h1>,
  },
  {
    path: "*",
    element: <h1>404</h1>,
  },
];

export default routes;
