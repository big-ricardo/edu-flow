import React from "react";
import MyActivities from "./components/MyActivities";
import { Flex } from "@chakra-ui/react";
import ApprovedActivities from "./components/ActivitiesProcess";
import ActivitiesAccept from "./components/ActivitiesAccept";
import OpenForms from "./components/OpenForms";
import PendingInteractions from "./components/MyPendingInteractions";
import BoardDefinitions from "./components/BoardDefinitions";
import PendingEvaluations from "./components/MyPendingEvaluations";
import Can from "@components/atoms/Can";
import ActivityTracking from "./components/MyActivitiesTracking";
import Tutorial, { JoyrideSteps } from "@components/molecules/Tutorial";

const steps: JoyrideSteps = [
  {
    target: "#open-forms",
    content: "dashboard.joyride.open-forms",
  },
  {
    target: "#my-activities",
    content: "dashboard.joyride.my-activities",
  },
  {
    target: "#activity-tracking",
    content: "dashboard.joyride.activity-tracking",
    permission: "activity.committed",
  },
  {
    target: "#switch-theme",
    content: "dashboard.joyride.switch-theme",
  },
  {
    target: "#profile-menu",
    content: "dashboard.joyride.profile-menu",
  },
];

const Dashboard: React.FC = () => {
  return (
    <Flex p={[4, 8]} width="100%" direction="column" gap={8}>
      <Tutorial steps={steps} name="dashboard" />
      <Can permission="activity.create">
        <OpenForms />
      </Can>
      <MyActivities />
      <Can permission="activity.committed">
        <ApprovedActivities />
      </Can>
      <Can permission="activity.board-definition">
        <BoardDefinitions />
      </Can>
      <Can permission="activity.accept">
        <ActivitiesAccept />
        <ActivityTracking />
      </Can>
      <PendingInteractions />
      <PendingEvaluations />
    </Flex>
  );
};

export default Dashboard;
