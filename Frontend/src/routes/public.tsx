import { NotFoundPage } from "@pages/NotFound";
import { RouteType } from ".";

import Login from "@pages/Auth/Login";

const routes: RouteType = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export default routes;
