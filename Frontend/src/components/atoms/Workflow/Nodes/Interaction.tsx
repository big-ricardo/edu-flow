import { Box, Flex, useColorModeValue, Text } from "@chakra-ui/react";
import { NodeProps, Position } from "reactflow";
import WrapperNode from "./Wrapper";
import { FaWpforms } from "react-icons/fa";
import { IInteraction } from "@interfaces/WorkflowDraft";
import CustomHandle from "../CustomHandle";

interface InteractionProps extends NodeProps {
  data: IInteraction;
}

const Interaction: React.FC<InteractionProps> = (props) => {
  return (
    <WrapperNode
      {...props}
      numberOfSources={props.data?.conditional?.length > 0 ? 2 : 1}
    >
      <Box
        as={FaWpforms}
        size="25px"
        color={useColorModeValue("gray.500", "gray.300")}
      />
      <Text fontSize="xs" textAlign="center" noOfLines={1}>
        {props.data?.name}
      </Text>

      <CustomHandle
        type="source"
        position={Position.Bottom}
        handleId="alternative-source"
        style={{
          background: "violet",
          bottom: "-10px",
          opacity: props.data?.conditional?.length > 0 ? 1 : 0,
        }}
        title="Conexão Alternativa"
        isConnectable={props.data?.conditional?.length > 0}
      />
    </WrapperNode>
  );
};

export default Interaction;

export function InteractionIcon() {
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
        as={FaWpforms}
        size="40px"
        color={useColorModeValue("gray.500", "gray.300")}
      />
    </Flex>
  );
}
