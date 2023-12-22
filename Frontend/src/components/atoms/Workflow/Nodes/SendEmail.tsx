import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { NodeProps } from "reactflow";
import WrapperNode from "./Wrapper";
import { BiMailSend } from "react-icons/bi";

interface SendEmailProps extends NodeProps {
  data: {
    to: string;
    subject: string;
    template_id: string;
  };
}

const SendEmail: React.FC<SendEmailProps> = (props) => {
  return (
    <WrapperNode {...props}>
      <Box
        as={BiMailSend}
        size="60px"
        color={useColorModeValue("blue.400", "blue.600")}
        border="2px solid"
        borderColor={useColorModeValue("blue.400", "blue.600")}
        borderRadius="50%"
        p="10px"
      />
    </WrapperNode>
  );
};

export default SendEmail;

export function SendEmailIcon() {
  return (
    <Flex
      bg={useColorModeValue("white", "gray.100")}
      width="100px"
      height="100px"
      alignItems="center"
      justifyContent="center"
      border="1px solid"
      borderColor={useColorModeValue("blue.400", "blue.600")}
      borderRadius="15px"
    >
      <Box
        as={BiMailSend}
        size="60px"
        color={useColorModeValue("blue.400", "blue.600")}
        border="2px solid"
        borderColor={useColorModeValue("blue.400", "blue.600")}
        borderRadius="50%"
        p="10px"
      />
    </Flex>
  );
}
