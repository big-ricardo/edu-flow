import React, { memo, useCallback, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Connection,
  ConnectionMode,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
  Node,
  ReactFlowInstance,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import NodeTypes from "@components/atoms/Workflow/Nodes";
import EdgeTypes from "@components/atoms/Workflow/Edges";
import FlowPanel from "@components/molecules/Workflow/FlowPanel";
import FlowHeader from "@components/molecules/Workflow/FlowHeader";

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: { label: "Inicio", hasHandleRight: true },
    type: "circle",
    deletable: false,
  },
  {
    id: "2",
    position: { x: 100, y: 0 },
    data: { label: "Fim", hasHandleLeft: true },
    type: "circle",
    deletable: false,
  },
];
const initialEdges: Edge[] = [];

const FlowBoard: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      }) ?? { x: 0, y: 0 };

      setNodes((nodes) => [
        ...nodes,
        {
          id: crypto.randomUUID(),
          type,
          position: position,
          data: {},
        },
      ]);
    },
    [reactFlowInstance, setNodes]
  );

  return (
    <div
      className="reactflow-wrapper"
      ref={reactFlowWrapper}
      style={{ height: "100%" }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={NodeTypes}
        edgeTypes={EdgeTypes}
        proOptions={{
          hideAttribution: true,
        }}
        connectionMode={ConnectionMode.Loose}
        defaultEdgeOptions={{
          type: "default",
          labelStyle: { fill: "#fff", fontWeight: 700 },
          markerEnd: {
            type: MarkerType.Arrow,
          },
        }}
        onDrop={onDrop}
        onInit={setReactFlowInstance}
        onDragOver={onDragOver}
      >
        <FlowHeader />
        <Background color="#aaa" gap={16} size={1} />
        <Controls />
        <MiniMap />
        <FlowPanel />
      </ReactFlow>
    </div>
  );
};

const FlowBoardMemo = memo(FlowBoard);
export default FlowBoardMemo;
