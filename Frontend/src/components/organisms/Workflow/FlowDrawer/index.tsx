import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import BlockConfig from "@components/molecules/Workflow/FlowPanel/BlockConfig";
import useDrawer from "@hooks/useDrawer";
import { useState } from "react";
import { Node, useOnSelectionChange } from "reactflow";

interface FlowDrawerProps {}

const FlowDrawer: React.FC<FlowDrawerProps> = () => {
  const { isOpen, onClose } = useDrawer();
  const [node, setNode] = useState<Node | null>(null);

  useOnSelectionChange({
    onChange: ({ nodes }) => {
      if (nodes.length === 1) {
        setNode(nodes[0]);
      } else {
        setNode(null);
      }
    },
  });

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Create your account</DrawerHeader>
        <DrawerBody>
          <BlockConfig node={node} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default FlowDrawer;
