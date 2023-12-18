import { RouteType } from ".";

import Portal from "@pages/Portal";
import Dashboard from "@pages/Portal/Dashboard";
import Workflows from "@pages/Portal/Workflows";
import Workflow from "@pages/Portal/Workflows/[id]";

const routes: RouteType = [
  {
    path: "/portal",
    element: <Portal />,
    children: [
      {
        element: <Dashboard />,
        index: true,
      },
      {
        path: "/portal/workflows",
        element: <Workflows />,
      },
      {
        path: "/portal/workflow/:id",
        element: <Workflow />,
      },
    ],
  },
];

export default routes;
