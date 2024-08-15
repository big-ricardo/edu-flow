import { Flex, Box, Heading } from "@chakra-ui/react";
import Icon from "@components/atoms/Icon";
import { Outlet } from "react-router-dom";

function Welcome() {
  return (
    <Flex direction="column" justify="center" minH="100vh">
      <Flex justify="center" mb={4} align="center">
        <div>
          <Icon boxSize={24} mx="auto" mb={2} />
        </div>
        <Heading size="lg" textAlign="center">
          Eduflow
        </Heading>
      </Flex>
      <Box w="90%" p={4} mx="auto" my={8} bg="bg.cardBlack">
        <Outlet />
      </Box>
    </Flex>
  );
}

export default Welcome;
