import { Box, Flex, useColorModeValue, Text } from "@chakra-ui/react";
import { NodeProps } from "reactflow";
import WrapperNode from "./Wrapper";
import { GoWorkflow } from "react-icons/go";

interface SwapWorkflowProps extends NodeProps {
  data: {
    to: string;
    subject: string;
    template_id: string;
    name: string;
  };
}

const SwapWorkflow: React.FC<SwapWorkflowProps> = (props) => {
  return (
    <WrapperNode {...props}>
      <Box
        as={GoWorkflow}
        size="30px"
        color={useColorModeValue("gray.500", "gray.300")}
      />
      <Text fontSize="xs" textAlign="center" noOfLines={1}>
        {props.data?.name}
      </Text>
    </WrapperNode>
  );
};

export default SwapWorkflow;

export function SwapWorkflowIcon() {
  return (
    <Flex
      bg={useColorModeValue("white", "gray.800")}
      width="100px"
      height="80px"
      alignItems="center"
      justifyContent="center"
      border="1px solid"
      borderColor={useColorModeValue("gray.300", "gray.600")}
      borderRadius="3px"
      transition="border-color 0.3s ease-in-out"
    >
      <Box
        as={GoWorkflow}
        size="50px"
        color={useColorModeValue("gray.500", "gray.300")}
      />
    </Flex>
  );
}
