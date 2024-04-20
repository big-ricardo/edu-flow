import {
  Box,
  Card,
  Divider,
  Flex,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { MilestoneEnd, MilestoneItem } from "@components/molecules/TimeLine";
import IActivity, { IActivityStep } from "@interfaces/Activitiy";
import { IStep, NodeTypes } from "@interfaces/WorkflowDraft";
import React, { useCallback, useMemo } from "react";
import { GoMilestone, GoTag } from "react-icons/go";
import { LiaNotesMedicalSolid } from "react-icons/lia";
import { FaWpforms } from "react-icons/fa";
import { BiMailSend } from "react-icons/bi";
import { GoWorkflow } from "react-icons/go";

interface MilestoneItemProps {
  workflows: IActivity["workflows"];
}

const Timeline: React.FC<MilestoneItemProps> = ({ workflows }) => {
  return (
    <Box>
      {workflows?.map((workflow) => (
        <TimelineWorkflowItem key={workflow._id} workflow={workflow} />
      ))}
      <MilestoneEnd />
    </Box>
  );
};

export default Timeline;

const TimelineWorkflowItem = ({
  workflow,
}: {
  workflow: IActivity["workflows"][0];
}) => {
  const getStep = useCallback(
    (stepId: string) => {
      return workflow.workflow_draft.steps.find((step) => step._id === stepId);
    },
    [workflow.workflow_draft.steps]
  );

  return (
    <div>
      {workflow?.steps?.map((step) => (
        <TimelineStepItem
          key={step._id}
          data={step}
          step={getStep(step.step)}
        />
      ))}
    </div>
  );
};

const TimelineStepItem = ({
  data,
  step,
}: {
  step: IStep | undefined;
  data: IActivityStep;
}) => {
  const Icon = useMemo(() => {
    switch (step?.type) {
      case NodeTypes.Interaction:
        return FaWpforms;
      case NodeTypes.SendEmail:
        return BiMailSend;
      case NodeTypes.ChangeStatus:
        return GoTag;
      case NodeTypes.SwapWorkflow:
        return GoWorkflow;
      case NodeTypes.Evaluated:
        return LiaNotesMedicalSolid;
      case NodeTypes.Circle:
        return GoMilestone;
      default:
        return FaWpforms;
    }
  }, [step?.type]);

  const bg = useColorModeValue("gray.200", "gray.800");

  if (!step) return null;

  return (
    <MilestoneItem key={step._id} isStep status={data.status}>
      <Flex
        gap={2}
        px={4}
        py={3}
        borderRadius="lg"
        alignItems="start"
        direction="column"
        bg={bg}
      >
        <Flex direction="row" alignItems="center" gap={2}>
          <Icon size={20} />
          <Text fontSize="md">{step.data?.name}</Text>
        </Flex>
        <Divider my={2} />
        <Text fontSize="sm" color="gray.500">
          "ojdposakdop iojkdpoask"
        </Text>
      </Flex>
    </MilestoneItem>
  );
};
