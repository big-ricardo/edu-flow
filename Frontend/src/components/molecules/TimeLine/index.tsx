import {
  Box,
  BoxProps,
  Circle,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { IActivityStepStatus } from "@interfaces/Activitiy";
import { useMemo } from "react";
import { BiLayer } from "react-icons/bi";
import {
  GoWorkflow,
  GoCheckCircleFill,
  GoXCircleFill,
  GoClockFill,
  GoSync,
} from "react-icons/go";

interface MilestoneItemProps extends BoxProps {
  icon?: ReturnType<typeof GoWorkflow>;
  boxProps?: BoxProps;
  skipTrail?: boolean;
  isStep?: boolean;
  status: IActivityStepStatus;
}

export const MilestoneItem: React.FC<MilestoneItemProps> = ({
  boxProps = {},
  skipTrail = false,
  children,
  status,
  ...props
}) => {
  const icon = useMemo(() => {
    switch (status) {
      case IActivityStepStatus.finished:
        return GoCheckCircleFill;
      case IActivityStepStatus.error:
        return GoXCircleFill;
      case IActivityStepStatus.inProgress:
        return GoSync;
      case IActivityStepStatus.inQueue:
        return BiLayer;
      case IActivityStepStatus.idle:
        return GoClockFill;
      default:
        return GoWorkflow;
    }
  }, [status]);

  const message = useMemo(() => {
    switch (status) {
      case IActivityStepStatus.finished:
        return "Concluído";
      case IActivityStepStatus.error:
        return "Erro";
      case IActivityStepStatus.inProgress:
        return "Em Progresso";
      case IActivityStepStatus.inQueue:
        return "Em fila para processamento";
      case IActivityStepStatus.idle:
        return "Pendente";
      default:
        return "Desconhecido";
    }
  }, [status]);

  return (
    <Flex {...props} minH={"5rem"}>
      <Flex
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        mr={4}
        ml={2}
        pos="relative"
        gap={1}
      >
        <Circle
          size={8}
          bg={useColorModeValue("gray.200", "gray.900")}
          opacity={useColorModeValue(0.5, 0.8)}
          title={message}
        >
          <Box as={icon} size={"60%"} />
        </Circle>
        {!skipTrail && <Box w="1px" flex={1} bg={"gray"} my={-1} zIndex={0} />}
      </Flex>
      <Box {...boxProps} pb={5} maxW={"80%"}>
        {children}
      </Box>
    </Flex>
  );
};

export const MilestoneEnd: React.FC = ({ ...props }) => {
  return (
    <Flex {...props}>
      <Flex
        flexDir="column"
        alignItems="start"
        justifyContent="start"
        mr={4}
        ml={4}
        mt={1}
        pos="relative"
      >
        <Circle
          size={4}
          bg={useColorModeValue("gray.400", "gray.900")}
          opacity={useColorModeValue(0.5, 0.8)}
        />
      </Flex>
    </Flex>
  );
};
