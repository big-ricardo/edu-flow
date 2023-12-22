import { Flex, Box, Heading } from "@chakra-ui/react";
import MdxEditor from "@components/organisms/EmailTemplate";
import React from "react";

const EmailTemplate: React.FC = () => {
  return (
    <Flex justify="center" align="center" w="100%">
      <Box w="100%" h="100%" p="4">
        <Heading size="md">Teste</Heading>
        <Box mt="4">
          <Heading size="sm">Editor</Heading>
          <MdxEditor />
        </Box>
      </Box>
    </Flex>
  );
};

export default EmailTemplate;
