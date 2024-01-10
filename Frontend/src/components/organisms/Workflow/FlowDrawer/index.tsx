import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Divider,
} from "@chakra-ui/react";
import BlockConfig from "@components/molecules/Workflow/FlowPanel/BlockConfig";
import useDrawer from "@hooks/useDrawer";
import { NodeTypes } from "@interfaces/Workflow";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useOnSelectionChange, useReactFlow } from "reactflow";

interface FlowDrawerProps {}

const FlowDrawer: React.FC<FlowDrawerProps> = () => {
  const { isOpen, onClose } = useDrawer();
  const [searchParams, setSearchParams] = useSearchParams();
  const { getNode } = useReactFlow();

  const node = getNode(searchParams.get("node") ?? "");

  const { setNodes } = useReactFlow();

  useOnSelectionChange({
    onChange: ({ nodes }) => {
      if (nodes.length === 1) {
        setSearchParams({ node: nodes[0].id });
      } else {
        setSearchParams({});
      }
    },
  });

  const onSave = useCallback(
    (data: object) => {
      setNodes((nodes) => {
        const newNodes = [...nodes];

        const nodeIndex = newNodes.findIndex((el) => el.id === node?.id);

        newNodes[nodeIndex].data = { ...newNodes[nodeIndex].data, ...data };

        return newNodes;
      });
      onClose();
    },
    [setNodes, onClose, node?.id]
  );

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Configurações</DrawerHeader>
        <Divider />
        <DrawerBody>
          <BlockConfig
            type={node?.type as NodeTypes}
            data={node?.data}
            onSave={onSave}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default FlowDrawer;
