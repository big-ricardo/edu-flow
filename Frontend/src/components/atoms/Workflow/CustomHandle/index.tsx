import React, { useMemo } from "react";
import {
  Handle,
  HandleProps,
  getConnectedEdges,
  useNodeId,
  useReactFlow,
  useStore,
} from "reactflow";

interface WrapperNodeProps extends HandleProps, React.HTMLAttributes<HTMLDivElement> {}

const CustomHandle: React.FC<WrapperNodeProps> = (props) => {
  const id = useNodeId() ?? "";
  const edges = useStore((store) => store.edges);
  const { getNode } = useReactFlow();
  const node = getNode(id);

  const isHandleConnectable = useMemo(() => {
    if (!node) return false;

    const connectedEdges = getConnectedEdges([node], edges);

    return connectedEdges.filter((edge) => edge.source === node.id).length < 1;
  }, [edges, node]);

  return (
    <Handle
      isConnectable={isHandleConnectable}
      style={{ background: "#555", right: "-10px" }}
      {...props}
    />
  );
};

export default CustomHandle;
