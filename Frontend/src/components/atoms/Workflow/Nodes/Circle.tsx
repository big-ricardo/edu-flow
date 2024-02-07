import {
  Badge,
  Box,
  Button,
  Flex,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import useDrawer from "@hooks/useDrawer";
import React, { useMemo } from "react";
import { BiInfoCircle, BiSliderAlt } from "react-icons/bi";
import { Handle, NodeProps, Position } from "reactflow";
import CustomHandle from "../CustomHandle";

interface CircleNodeProps extends NodeProps {
  data: {
    label: string;
    hasHandleLeft?: boolean;
    hasHandleRight?: boolean;
    hasMenu?: boolean;
    name?: string;
  };
}

const CircleNode: React.FC<CircleNodeProps> = ({ data, selected }) => {
  const menuBg = useColorModeValue("white", "gray.700");
  const { onOpen } = useDrawer();
  const theme = useColorMode();

  const borderColor = useMemo(() => {
    if (selected) return "black.500";
    if (theme.colorMode === "light") return "gray.400";
    return "gray.500";
  }, [selected, theme.colorMode]);

  return (
    <Flex
      bg={useColorModeValue("gray.300", "gray.700")}
      width="50px"
      height="50px"
      borderRadius="50%"
      alignItems="center"
      justifyContent="center"
      border="1px solid"
      borderColor={borderColor}
    >
      {!data?.name && data?.hasMenu && (
        <Box position="absolute" top={-1} right={2} textAlign="center">
          <Badge colorScheme="red" borderRadius="full" p={0}>
            <BiInfoCircle />
          </Badge>
        </Box>
      )}
      <div>{data.label}</div>
      {data?.hasHandleLeft && (
        <Handle
          type="target"
          id="default-target"
          position={Position.Left}
          style={{ background: "#555", left: "-10px" }}
        />
      )}

      {selected && data.hasMenu && (
        <Flex
          position="absolute"
          bottom="-35px"
          cursor="pointer"
          bg={menuBg}
          borderRadius="5px"
          p="3px"
          gap="1"
        >
          <Button
            className="edgebutton"
            onClick={onOpen}
            size="xs"
            rounded="full"
            p={0}
            colorScheme="gray"
          >
            <BiSliderAlt size="15px" />
          </Button>
        </Flex>
      )}

      {data?.hasHandleRight && (
        <CustomHandle
          handleId="default-source"
          type="source"
          position={Position.Right}
          style={{ background: "#555", right: "-10px" }}
        />
      )}
    </Flex>
  );
};

export default CircleNode;
