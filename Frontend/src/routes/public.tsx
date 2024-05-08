import { NotFoundPage } from "@pages/NotFound";
import { RouteType } from ".";

import Login from "@pages/Auth/Login";
import ForgotPassword from "@pages/Auth/ForgotPassword";

const routes: RouteType = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/auth/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export default routes;
