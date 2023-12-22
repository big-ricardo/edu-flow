import { Flex, useColorModeValue } from "@chakra-ui/react";
import { SendEmailIcon } from "@components/atoms/Workflow/Nodes/SendEmail";
import PanelItem from "@components/atoms/Workflow/PanelItem";
import React from "react";
import { Panel } from "reactflow";

const FlowPanel: React.FC = () => {
  return (
    <Panel position="bottom-center" style={{ width: "fit-content", margin: 0 }}>
      <Flex
        bg={useColorModeValue("gray.100", "gray.700")}
        width="100%"
        height="100%"
        alignItems="center"
        justifyContent="center"
        px="10"
        py="2"
        borderRadius="10px"
        border="1px solid"
        borderColor={useColorModeValue("gray.400", "gray.600")}
        position={"relative"}
      >
        <PanelItem nodeType="send_email">
          <SendEmailIcon />
        </PanelItem>
      </Flex>
    </Panel>
  );
};

export default FlowPanel;
