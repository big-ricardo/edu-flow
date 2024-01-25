import { Box, Flex, useColorModeValue, Text } from "@chakra-ui/react";
import { NodeProps } from "reactflow";
import WrapperNode from "./Wrapper";
import { HiOutlineDocumentPlus } from "react-icons/hi2";

interface InteractionProps extends NodeProps {
  data: {
    to: string;
    subject: string;
    template_id: string;
    name: string;
  };
}

const Interaction: React.FC<InteractionProps> = (props) => {
  return (
    <WrapperNode {...props} numberOfSources={1}>
      <Box
        as={HiOutlineDocumentPlus}
        size="30px"
        color={useColorModeValue("gray.500", "gray.300")}
      />
      <Text fontSize="xs" textAlign="center" noOfLines={1}>
        {props.data?.name}
      </Text>
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
        as={HiOutlineDocumentPlus}
        size="50px"
        color={useColorModeValue("gray.500", "gray.300")}
      />
    </Flex>
  );
}
