import React from "react";
import MyActivities from "./components/MyActivities";
import { Box } from "@chakra-ui/react";
import ApprovedActivities from "./components/ActivitiesProcess";

const Dashboard: React.FC = () => {
  return (
    <Box p={8} width="100%">
      <h1>Dashboard</h1>
      <MyActivities />
      <ApprovedActivities />
    </Box>
  );
};

export default Dashboard;
