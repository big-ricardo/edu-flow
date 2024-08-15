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
import EditResponse from "@pages/Edit";
import ActivityBoardDefinition from "@pages/Portal/ActivityBordDefinition";
import Activities from "@pages/Portal/Activities";
import FirstPage from "@pages/Welcome/Firstpage";
import SecondPage from "@pages/Welcome/SecondPage";
import Welcome from "@pages/Welcome";

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
        permission: "workflow.view",
      },
      {
        path: "/portal/workflow",
        element: <Workflow />,
        permission: "workflow.create",
      },
      {
        path: "/portal/workflow/:id",
        element: <Workflow />,
        permission: "workflow.update",
      },
      {
        path: "/portal/workflow-draft/:workflow_id/:id/view",
        element: <WorkflowDraft isView />,
        permission: "workflowDraft.view",
      },
      {
        path: "/portal/workflow-draft/:workflow_id/:id/edit",
        element: <WorkflowDraft />,
        permission: "workflowDraft.create",
      },
      {
        path: "/portal/workflow-draft/:workflow_id",
        element: <WorkflowDraft />,
        permission: "workflowDraft.create",
      },
      {
        path: "/portal/emails",
        element: <EmailsTemplate />,
        permission: "email.view",
      },
      {
        path: "/portal/email",
        element: <EmailTemplate />,
        permission: "email.create",
      },
      {
        path: "/portal/email/:id",
        element: <EmailTemplate />,
        permission: "email.update",
      },
      {
        path: "/portal/users",
        element: <Users />,
        permission: "user.view",
      },
      {
        path: "/portal/user",
        element: <User />,
        permission: "user.create",
      },
      {
        path: "/portal/user/:id",
        element: <User />,
        permission: "user.update",
      },
      {
        path: "/portal/institutes",
        element: <Institutes />,
        permission: "institute.view",
      },
      {
        path: "/portal/institute",
        element: <Institute />,
        permission: "institute.create",
      },
      {
        path: "/portal/institute/:id",
        element: <Institute />,
        permission: "institute.update",
      },
      {
        path: "/portal/universities",
        element: <Universities />,
        permission: "university.view",
      },
      {
        path: "/portal/university",
        element: <University />,
        permission: "university.create",
      },
      {
        path: "/portal/university/:id",
        element: <University />,
        permission: "university.update",
      },
      {
        path: "/portal/statuses",
        element: <Statuses />,
        permission: "status.view",
      },
      {
        path: "/portal/status",
        element: <Status />,
        permission: "status.create",
      },
      {
        path: "/portal/status/:id",
        element: <Status />,
        permission: "status.update",
      },
      {
        path: "/portal/forms",
        element: <Forms />,
        permission: "form.view",
      },
      {
        path: "/portal/form",
        element: <Form />,
        permission: "form.create",
      },
      {
        path: "/portal/form/:id",
        element: <Form />,
        permission: "form.update",
      },
      {
        path: "/portal/form-draft/:form_id/:id?",
        element: <FormDraft />,
        permission: "formDraft.create",
      },
      {
        path: "/portal/activities",
        element: <Activities />,
        permission: "activity.view",
      },
      {
        path: "/portal/activity/:id",
        element: <Activity />,
        permission: "activity.read",
      },
      {
        path: "/portal/activity-process/:id",
        element: <ActivityProcess />,
        permission: "activity.committed",
      },
      {
        path: "/portal/activity-accept/:id",
        element: <ActivityAccept />,
        permission: "activity.accept",
      },
      {
        path: "/portal/activity/:id/board-definition/:evaluation_id",
        element: <ActivityBoardDefinition />,
        permission: "activity.board-definition",
      },
    ],
  },
  {
    path: "/response/:slug",
    element: <Response />,
  },
  {
    path: "/welcome",
    element: <Welcome />,
    children: [
      {
        element: <FirstPage />,
        index: true,
      },
      {
        element: <SecondPage />,
        path: "/welcome/second-page",
      },
    ],
  },
  {
    path: "/response/:id/edit",
    element: <EditResponse />,
  },
];

export default routes;
