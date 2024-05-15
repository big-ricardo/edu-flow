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

const Dashboard: React.FC = () => {
  return (
    <Flex p={8} width="100%" direction="column" gap={8}>
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
