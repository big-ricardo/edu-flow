import React from "react";
import MyActivities from "./components/MyActivities";
import { Box } from "@chakra-ui/react";
import ApprovedActivities from "./components/ActivitiesProcess";
import ActivitiesAccept from "./components/ActivitiesAccept";
import OpenForms from "./components/OpenForms";

const Dashboard: React.FC = () => {
  return (
    <Box p={8} width="100%">
      <h1>Dashboard</h1>
      <OpenForms />
      <MyActivities />
      <ApprovedActivities />
      <ActivitiesAccept />
    </Box>
  );
};

export default Dashboard;
