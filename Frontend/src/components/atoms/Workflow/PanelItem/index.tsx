import { Box } from "@chakra-ui/react";
import { NodeTypes } from "@interfaces/Workflow";
import React, { useCallback } from "react";

interface PanelItemProps {
  children: React.ReactNode;
  nodeType: NodeTypes;
}

const PanelItem: React.FC<PanelItemProps> = ({ children, nodeType }) => {
  const onDragStart = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData("application/reactflow", nodeType);
      event.dataTransfer.effectAllowed = "move";
    },
    [nodeType],
  );

  return (
    <Box
      transition="transform 0.3s ease-in-out"
      _hover={{
        transform: "translateY(-20px)",
      }}
      height="50px"
      cursor="pointer"
      draggable
      shadow="md"
      onDragStart={onDragStart}
      pb="2"
    >
      {children}
    </Box>
  );
};

export default PanelItem;
