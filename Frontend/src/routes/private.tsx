import { RouteType } from ".";

import Portal from "@pages/Portal";
import Dashboard from "@pages/Portal/Dashboard";
import Workflows from "@pages/Portal/Workflows";
import Workflow from "@pages/Portal/Workflows/Workflow";
import EmailsTemplate from "@pages/Portal/EmailsTemplate";
import EmailTemplate from "@pages/Portal/EmailsTemplate/EmailTemplate";
import Users from "@pages/Portal/Users";
import Institutes from "@pages/Portal/Institutes";
import Institute from "@pages/Portal/Institutes/Institute";
import University from "@pages/Portal/Universities/University";
import Universities from "@pages/Portal/Universities";
import User from "@pages/Portal/Users/User";

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
      {
        path: "/portal/emails",
        element: <EmailsTemplate />,
      },
      {
        path: "/portal/email/:id",
        element: <EmailTemplate />,
      },
      {
        path: "/portal/users",
        element: <Users />,
      },
      {
        path: "/portal/user/:id",
        element: <User />,
      },
      {
        path: "/portal/user",
        element: <User />,
      },
      {
        path: "/portal/institutes",
        element: <Institutes />,
      },
      {
        path: "/portal/institute/:id",
        element: <Institute />,
      },
      {
        path: "/portal/institute",
        element: <Institute />,
      },
      {
        path: "/portal/universities",
        element: <Universities />,
      },
      {
        path: "/portal/university/:id",
        element: <University />,
      },
      {
        path: "/portal/university",
        element: <University />,
      },
    ],
  },
];

export default routes;
