import { Box, Flex, useColorModeValue, Text } from "@chakra-ui/react";
import { NodeProps } from "reactflow";
import WrapperNode from "./Wrapper";
import { BiMailSend } from "react-icons/bi";

interface SendEmailProps extends NodeProps {
  data: {
    to: string;
    subject: string;
    template_id: string;
    name: string;
  };
}

const SendEmail: React.FC<SendEmailProps> = (props) => {
  return (
    <WrapperNode {...props}>
      <Box
        as={BiMailSend}
        size="30px"
        color={useColorModeValue("gray.500", "gray.300")}
      />
      <Text fontSize="xs" textAlign="center" noOfLines={1}>
        {props.data?.name}
      </Text>
    </WrapperNode>
  );
};

export default SendEmail;

export function SendEmailIcon() {
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
        as={BiMailSend}
        size="50px"
        color={useColorModeValue("gray.500", "gray.300")}
      />
    </Flex>
  );
}
