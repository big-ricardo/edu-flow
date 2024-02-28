import React, { useMemo } from "react";
import {
  Handle,
  HandleProps,
  getConnectedEdges,
  useNodeId,
  useReactFlow,
  useStore,
} from "reactflow";

interface WrapperNodeProps
  extends HandleProps,
    React.HTMLAttributes<HTMLDivElement> {
  handleId: string;
}

const CustomHandle: React.FC<WrapperNodeProps> = ({ handleId, ...props }) => {
  const id = useNodeId() ?? "";
  const edges = useStore((store) => store.edges);
  const { getNode } = useReactFlow();
  const node = getNode(id);

  const isHandleConnectable = useMemo(() => {
    if (!node) return false;

    const connectedEdges = getConnectedEdges([node], edges);

    return (
      connectedEdges.filter(
        (edge) => edge.sourceHandle === handleId && edge.source === id,
      ).length === 0
    );
  }, [edges, node, handleId, id]);

  return (
    <Handle id={handleId} isConnectable={isHandleConnectable} {...props} />
  );
};

export default CustomHandle;
