import { Box, Flex, useColorModeValue, Text } from "@chakra-ui/react";
import { NodeProps, Position } from "reactflow";
import WrapperNode from "./Wrapper";
import { BiGitRepoForked } from "react-icons/bi";
import CustomHandle from "../CustomHandle";

interface ConditionalProps extends NodeProps {
  data: {
    name: string;
    visible: boolean;
    form_id: string;
    conditional: Array<{
      field: string;
      value: string;
      operator: "==" | "!=" | ">" | "<" | ">=" | "<=" | "contains";
    }>;
    ifNotExists: string;
  };
}

const Conditional: React.FC<ConditionalProps> = (props) => {
  return (
    <WrapperNode {...props} numberOfSources={2}>
      <Box
        as={BiGitRepoForked}
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

export default Conditional;

export function ConditionalIcon() {
  return (
    <Flex
      bg={"bg.card"}
      width="100px"
      height="80px"
      alignItems="center"
      justifyContent="center"
      border="1px solid"
      borderRadius="3px"
      transition="border-color 0.3s ease-in-out"
      borderColor={"bg.page"}
    >
      <Box
        as={BiGitRepoForked}
        size="50px"
        color={useColorModeValue("gray.500", "gray.300")}
      />
    </Flex>
  );
}
