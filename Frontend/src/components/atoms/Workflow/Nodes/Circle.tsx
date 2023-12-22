import { Flex, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { Handle, NodeProps, Position } from "reactflow";

interface CircleNodeProps extends NodeProps {
  data: {
    label: string;
    hasHandleLeft?: boolean;
    hasHandleRight?: boolean;
  };
}

const CircleNode: React.FC<CircleNodeProps> = ({ data }) => {
  return (
    <Flex
      bg={useColorModeValue("gray.300", "gray.700")}
      width="50px"
      height="50px"
      borderRadius="50%"
      alignItems="center"
      justifyContent="center"
      border="1px solid"
      borderColor={useColorModeValue("gray.400", "gray.600")}
    >
      <div>{data.label}</div>
      {data?.hasHandleLeft && (
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: "#555", left: "-10px" }}
        />
      )}

      {data?.hasHandleRight && (
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: "#555", right: "-10px" }}
        />
      )}
    </Flex>
  );
};

export default CircleNode;
