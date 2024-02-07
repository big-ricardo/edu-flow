import {
  Badge,
  Box,
  Button,
  Flex,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useCallback, useMemo } from "react";
import { Handle, NodeProps, Position, useReactFlow } from "reactflow";
import { BsX } from "react-icons/bs";
import { BiSliderAlt, BiInfoCircle } from "react-icons/bi";
import useDrawer from "@hooks/useDrawer";
import CustomHandle from "../CustomHandle";
import { NodeTypes } from "@interfaces/Workflow";
import { validateNode } from "@components/molecules/Workflow/FlowPanel/BlockConfig/nodesSchema";

interface WrapperNodeProps extends NodeProps {
  children: React.ReactNode;
  deletable?: boolean;
  numberOfSources?: number;
}

const WrapperNode: React.FC<WrapperNodeProps> = ({
  id,
  children,
  selected,
  deletable,
  numberOfSources = 1,
}) => {
  const { deleteElements, getNode } = useReactFlow();
  const { onOpen } = useDrawer();
  const node = getNode(id);

  const theme = useColorMode();

  const isValid = useMemo(() => {
    return validateNode(node?.type as NodeTypes, node?.data);
  }, [node]);

  const onRemove = useCallback(() => {
    if (!node) return;

    deleteElements({
      nodes: [node],
    });
  }, [deleteElements, node]);

  const menuBg = useColorModeValue("white", "gray.700");

  const borderColor = useMemo(() => {
    if (selected) return "black.500";
    if (theme.colorMode === "light") return "gray.300";
    return "gray.600";
  }, [selected, theme.colorMode]);

  return (
    <Flex
      bg={useColorModeValue("white", "gray.700")}
      width="100px"
      height="50px"
      alignItems="center"
      direction={"column"}
      justifyContent="center"
      border="1px solid"
      borderColor={borderColor}
      borderRadius="3px"
      transition="border-color 0.3s ease-in-out"
      title={node?.data?.name}
    >
      {!isValid && (
        <Box position="absolute" top={-1} right={1} textAlign="center">
          <Badge colorScheme="red">
            <BiInfoCircle />
          </Badge>
        </Box>
      )}

      {selected && (
        <Flex
          position="absolute"
          bottom="-35px"
          cursor="pointer"
          bg={menuBg}
          borderRadius="5px"
          p="3px"
          gap="1"
        >
          {!deletable && (
            <Button
              className="edgebutton"
              onClick={onRemove}
              size="xs"
              rounded="full"
              colorScheme="red"
              p={0}
            >
              <BsX size="15px" />
            </Button>
          )}
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
      <Handle
        id="default-target"
        type="target"
        position={Position.Left}
        style={{ background: "#555", left: "-10px" }}
      />
      {numberOfSources > 0 && (
        <CustomHandle
          handleId="default-source"
          type="source"
          position={Position.Right}
          style={{ background: "#555", right: "-10px" }}
        />
      )}
      {children}
    </Flex>
  );
};

export default WrapperNode;
