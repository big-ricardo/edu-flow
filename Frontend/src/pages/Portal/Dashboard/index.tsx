import React from "react";
import MyActivities from "./components/MyActivities";
import { Flex } from "@chakra-ui/react";
import ApprovedActivities from "./components/ActivitiesProcess";
import ActivitiesAccept from "./components/ActivitiesAccept";
import OpenForms from "./components/OpenForms";
import PendingInteractions from "./components/MyPendingInteractions";
import BoardDefinitions from "./components/BoardDefinitions";
import PendingEvaluations from "./components/MyPendingEvaluations";

const Dashboard: React.FC = () => {
  return (
    <Flex p={8} width="100%" direction="column" gap={8}>
      <OpenForms />
      <MyActivities />
      <ApprovedActivities />
      <ActivitiesAccept />
      <PendingInteractions />
      <BoardDefinitions />
      <PendingEvaluations />
    </Flex>
  );
};

export default Dashboard;
