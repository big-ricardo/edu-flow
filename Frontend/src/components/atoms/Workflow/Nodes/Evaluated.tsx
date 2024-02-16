import { Box, Flex, useColorModeValue, Text } from "@chakra-ui/react";
import { NodeProps, Position } from "reactflow";
import WrapperNode from "./Wrapper";
import { LiaNotesMedicalSolid } from "react-icons/lia";
import CustomHandle from "../CustomHandle";

interface EvaluatedProps extends NodeProps {
  data: {
    to: string;
    subject: string;
    template_id: string;
    name: string;
  };
}

const Evaluated: React.FC<EvaluatedProps> = (props) => {
  return (
    <WrapperNode {...props} numberOfSources={2}>
      <Box
        as={LiaNotesMedicalSolid}
        size="30px"
        color={useColorModeValue("gray.500", "gray.300")}
      />
      <Text fontSize="xs" textAlign="center" noOfLines={1}>
        {props.data?.name}
      </Text>

      <CustomHandle
        type="source"
        position={Position.Bottom}
        handleId="alternative-source"
        style={{ background: "violet", bottom: "-10px" }}
        title="Conexão Alternativa"
      />
    </WrapperNode>
  );
};

export default Evaluated;

export function EvaluatedIcon() {
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
        as={LiaNotesMedicalSolid}
        size="50px"
        color={useColorModeValue("gray.500", "gray.300")}
      />
    </Flex>
  );
}
