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
import Joyride, { JoyrideSteps } from "@components/molecules/Joyride";

const steps: JoyrideSteps = [
  {
    target: "#open-forms",
    content:
      "Seja bem-vindo ao EduFlow! Aqui você pode visualizar os formulários disponíveis para preenchimento.",
  },
  {
    target: "#my-activities",
    content: "Aqui você verá as atividades que você já criou.",
  },
  {
    target: "#activity-tracking",
    content:
      "Aqui você verá as atividades que você está participando e o andamento delas.",
    permission: "activity.committed",
  },
  {
    target: "#switch-theme",
    content: "Clique aqui para alternar entre os temas claro e escuro.",
  },
  {
    target: "#profile-menu",
    content: "Clique aqui para acessar seu perfil e fazer logout.",
  },
];

const Dashboard: React.FC = () => {
  return (
    <Flex p={[4, 8]} width="100%" direction="column" gap={8}>
      <Joyride run steps={steps} />
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
