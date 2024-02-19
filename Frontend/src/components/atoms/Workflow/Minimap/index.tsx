import { useColorModeValue } from "@chakra-ui/react";
import React, { memo } from "react";
import { MiniMap } from "reactflow";

const Minimap: React.FC = memo(() => {
  const nodeColor = useColorModeValue("white", "#4A5568");
  const bgColor = useColorModeValue("#CBD5E0", "#1A202C");

  return (
    <MiniMap
      nodeColor={nodeColor}
      nodeBorderRadius={10}
      maskColor="rgba(0,0,0,0.3)"
      pannable
      zoomable
      zoomStep={3}
      style={{ background: bgColor }}
    />
  );
});

export default Minimap;
