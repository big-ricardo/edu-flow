import { RouteType } from ".";

import Portal from "@pages/Portal";
import Dashboard from "@pages/Portal/Dashboard";
import Workflows from "@pages/Portal/Workflows";
import Workflow from "@pages/Portal/Workflows/Workflow";
import WorkflowDraft from "@pages/Portal/WorkflowDraft";
import EmailsTemplate from "@pages/Portal/Emails";
import EmailTemplate from "@pages/Portal/Emails/Emails";
import Users from "@pages/Portal/Users";
import Institutes from "@pages/Portal/Institutes";
import Institute from "@pages/Portal/Institutes/Institute";
import University from "@pages/Portal/Universities/University";
import Universities from "@pages/Portal/Universities";
import User from "@pages/Portal/Users/User";
import Statuses from "@pages/Portal/Statuses";
import Status from "@pages/Portal/Statuses/Status";
import Forms from "@pages/Portal/Forms";
import Form from "@pages/Portal/Forms/Form";
import Response from "@pages/Response";
import FormDraft from "@pages/Portal/FormDrafts";
import Activity from "@pages/Portal/Activity";
import ActivityProcess from "@pages/Portal/ActivityCommit";
import ActivityAccept from "@pages/Portal/ActivityAccept";

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
        path: "/portal/workflow",
        element: <Workflow />,
      },
      {
        path: "/portal/workflow/:id?",
        element: <Workflow />,
      },
      {
        path: "/portal/workflow-draft/:workflow_id/:id/view",
        element: <WorkflowDraft isView />,
      },
      {
        path: "/portal/workflow-draft/:workflow_id/:id/edit",
        element: <WorkflowDraft />,
      },
      {
        path: "/portal/workflow-draft/:workflow_id",
        element: <WorkflowDraft />,
      },
      {
        path: "/portal/emails",
        element: <EmailsTemplate />,
      },
      {
        path: "/portal/email/:id?",
        element: <EmailTemplate />,
      },
      {
        path: "/portal/users",
        element: <Users />,
      },
      {
        path: "/portal/user/:id?",
        element: <User />,
      },
      {
        path: "/portal/institutes",
        element: <Institutes />,
      },
      {
        path: "/portal/institute/:id?",
        element: <Institute />,
      },
      {
        path: "/portal/universities",
        element: <Universities />,
      },
      {
        path: "/portal/university/:id?",
        element: <University />,
      },
      {
        path: "/portal/statuses",
        element: <Statuses />,
      },
      {
        path: "/portal/status/:id?",
        element: <Status />,
      },
      {
        path: "/portal/forms",
        element: <Forms />,
      },
      {
        path: "/portal/form/:id?",
        element: <Form />,
      },
      {
        path: "/portal/form-draft/:form_id/:id?",
        element: <FormDraft />,
      },
      {
        path: "/portal/activity/:id",
        element: <Activity />,
      },
      {
        path: "/portal/activity-process/:id",
        element: <ActivityProcess />,
      },
      {
        path: "/portal/activity-accept/:id",
        element: <ActivityAccept />,
      },
    ],
  },
  {
    path: "/response/:slug",
    element: <Response />,
  },
  {
    path: "/response/:slug/:activity_id",
    element: <Response />,
  },
];

export default routes;
