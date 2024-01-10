import {
  Box,
  Button,
  Flex,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Panel } from "reactflow";

interface FlowPanelProps {
  onSave: () => void;
  isPending?: boolean;
}

const FlowPanel: React.FC<FlowPanelProps> = ({ onSave, isPending }) => {
  const navigate = useNavigate();

  const handleNavigate = React.useCallback(() => {
    navigate("/portal/workflows");
  }, [navigate]);

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
        <Heading fontSize="lg">Workflow</Heading>

        <Box>
          <Button colorScheme="red" mr={2} onClick={handleNavigate} size="sm">
            <FaArrowLeft />
          </Button>
          <Button
            colorScheme="green"
            mr={2}
            onClick={onSave}
            size="sm"
            isLoading={isPending}
          >
            <FaSave />
          </Button>
        </Box>
      </Flex>
    </Panel>
  );
};

export default FlowPanel;
