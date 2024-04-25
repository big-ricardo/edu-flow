import {
  Box,
  Button,
  Divider,
  Flex,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { MilestoneEnd, MilestoneItem } from "@components/molecules/TimeLine";
import IActivity, { IActivityStep } from "@interfaces/Activitiy";
import { IStep, NodeTypes } from "@interfaces/WorkflowDraft";
import React, { useCallback, useMemo, useState } from "react";
import { GoMilestone, GoTag, GoWorkflow } from "react-icons/go";
import { LiaNotesMedicalSolid } from "react-icons/lia";
import { FaWpforms } from "react-icons/fa";
import { BiMailSend } from "react-icons/bi";
import useActivity from "@hooks/useActivity";
import IFormDraft, { IField } from "@interfaces/FormDraft";
import ExtraFields from "./ExtraFields";
import { BsArrowsFullscreen } from "react-icons/bs";

const statusMap = {
  idle: "Aguardando Resposta",
  finished: "Resposta Enviada",
  error: "Erro",
  in_progress: "Em Progresso",
  in_queue: "Em Fila",
};

interface MilestoneItemProps {}

const Timeline: React.FC<MilestoneItemProps> = () => {
  const { activity } = useActivity();
  const [modalData, setModalData] = useState<IField[] | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const workflows = activity?.workflows;

  const handleOpenModal = useCallback(
    (data: IField[]) => {
      setModalData(data);
      onOpen();
    },
    [onOpen]
  );

  return (
    <Box>
      {workflows?.map((workflow) => (
        <TimelineWorkflowItem
          key={workflow._id}
          {...{ workflow, handleOpenModal }}
        />
      ))}
      <MilestoneEnd />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent p="5" minW="400">
          <ModalCloseButton />

          <ExtraFields fields={modalData || []} />
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Timeline;

const TimelineWorkflowItem = ({
  workflow,
  handleOpenModal,
}: {
  workflow: IActivity["workflows"][0];
  handleOpenModal: (data: IField[]) => void;
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
          handleOpenModal={handleOpenModal}
        />
      ))}
    </div>
  );
};

const TimelineStepItem = ({
  data,
  step,
  handleOpenModal,
}: {
  step: IStep | undefined;
  data: IActivityStep;
  handleOpenModal: (data: IField[]) => void;
}) => {
  const { activity } = useActivity();
  const interactions = activity?.interactions;

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

  const interaction = useMemo(() => {
    if (step?.type === NodeTypes.Interaction) {
      return interactions?.find(
        (interaction) => interaction.activity_step_id === data._id
      );
    }

    return null;
  }, [data._id, step?.type, interactions]);

  const bg = useColorModeValue("gray.50", "gray.800");
  const border = useColorModeValue("black", "gray.100");

  const handleOpenModalItem = useCallback(
    (data: IFormDraft | null) => {
      const fields = data?.fields;
      if (!fields?.length) {
        return;
      }

      handleOpenModal(fields);
    },
    [handleOpenModal]
  );

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
        borderColor={border}
      >
        <Flex direction="row" alignItems="center" gap={2}>
          <Icon size={20} />
          <Text fontSize="md">{step.data?.name}</Text>
        </Flex>
        <Divider my={2} />
        {interaction && (
          <Box>
            {interaction.answers.map((answer) => (
              <Box key={answer._id}>
                <Text fontWeight="bold">{answer.user.name}</Text>
                <Text fontSize={"sm"}>{answer.user.email}</Text>

                {!!answer?.data && (
                  <Button
                    size="sm"
                    mt="1"
                    onClick={() => handleOpenModalItem(answer.data)}
                    variant={"outline"}
                    leftIcon={<BsArrowsFullscreen />}
                  >
                    {statusMap[answer.status]}
                  </Button>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Flex>
    </MilestoneItem>
  );
};
