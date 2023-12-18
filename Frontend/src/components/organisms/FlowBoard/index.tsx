import CircleNode from "@components/atoms/Nodes/Circle";
import React, { memo, useCallback } from "react";
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  Panel,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: { label: "Inicio", hasHandleRight: true },
    type: "circle",
  },
  {
    id: "2",
    position: { x: 100, y: 0 },
    data: { label: "Fim", hasHandleLeft: true },
    type: "circle",
  },
];
const initialEdges: Edge[] = [{ id: "e1-2", source: "1", target: "2" }];

const NodeTypes = {
  circle: CircleNode,
};

const FlowBoard: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      nodeTypes={NodeTypes}
      proOptions={{
        hideAttribution: true,
      }}
    >
      <Background color="#aaa" gap={16} size={1} />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
};

const FlowBoardMemo = memo(FlowBoard);
export default FlowBoardMemo;
