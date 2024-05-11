import { NotFoundPage } from "@pages/NotFound";
import { RouteType } from ".";

import Login from "@pages/Auth/Login";
import ForgotPassword from "@pages/Auth/ForgotPassword";
import AlterPassword from "@pages/Auth/AlterPassword";

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
    path: "/auth/alter-password/:token",
    element: <AlterPassword />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export default routes;
