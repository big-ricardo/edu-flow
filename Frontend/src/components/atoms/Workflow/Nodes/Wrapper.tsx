import { Box, Button, Flex, useColorModeValue } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { Handle, NodeProps, Position, useReactFlow } from "reactflow";
import { BsX } from "react-icons/bs";
import { BiSliderAlt, BiMailSend } from "react-icons/bi";
import useDrawer from "@hooks/useDrawer";

interface WrapperNodeProps extends NodeProps {
  children: React.ReactNode;
}

const WrapperNode: React.FC<WrapperNodeProps> = ({
  id,
  children,
  selected,
}) => {
  const { deleteElements, getNode } = useReactFlow();
  const { onOpen } = useDrawer();

  const onRemove = useCallback(() => {
    const node = getNode(id);

    if (!node) return;

    deleteElements({
      nodes: [node],
    });
  }, [deleteElements, getNode, id]);

  const menuBg = useColorModeValue("white", "gray.700");

  return (
    <Flex
      bg={useColorModeValue("white", "gray.700")}
      width="150px"
      height="100px"
      alignItems="center"
      justifyContent="center"
      border="2px solid"
      borderColor={selected ? "blue.700" : "blue.400"}
      borderRadius="10px"
      transition="border-color 0.3s ease-in-out"
    >
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
          <Button
            className="edgebutton"
            onClick={onRemove}
            size="xs"
            rounded="full"
            colorScheme="red"
            p={0}
          >
            <BsX size="15px"/>
          </Button>
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
        type="target"
        position={Position.Left}
        style={{ background: "#555", left: "-10px" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#555", right: "-10px" }}
      />
      {children}
    </Flex>
  );
};

export default WrapperNode;

export function SendEmailIcon() {
  return (
    <Flex
      bg={useColorModeValue("white", "gray.100")}
      width="100px"
      height="100px"
      alignItems="center"
      justifyContent="center"
      border="1px solid"
      borderColor={useColorModeValue("blue.400", "blue.600")}
    >
      <Box
        as={BiMailSend}
        size="60px"
        color={useColorModeValue("blue.400", "blue.600")}
        border="2px solid"
        borderColor={useColorModeValue("blue.400", "blue.600")}
        borderRadius="50%"
        p="10px"
      />
    </Flex>
  );
}
