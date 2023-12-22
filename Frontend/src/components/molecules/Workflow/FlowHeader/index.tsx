import {
  Box,
  Button,
  Flex,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { Panel } from "reactflow";

const FlowPanel: React.FC = () => {
  return (
    <Panel position="top-center" style={{ width: "100%", margin: 0 }}>
      <Flex
        bg={useColorModeValue("white", "gray.700")}
        width="100%"
        height="100%"
        alignItems="center"
        justifyContent="space-between"
        position={"relative"}
        p={2}
        shadow={"md"}
      >
        <Heading fontSize="lg">Flow Panel</Heading>

        <Box>
          <Button colorScheme="red" mr={2}>
            Cancelar
          </Button>
          <Button colorScheme="green" mr={2}>
            Salvar
          </Button>
        </Box>
      </Flex>
    </Panel>
  );
};

export default FlowPanel;
