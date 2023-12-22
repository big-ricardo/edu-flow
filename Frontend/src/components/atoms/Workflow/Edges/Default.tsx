import { Button } from "@chakra-ui/react";
import {
  EdgeProps,
  getSmoothStepPath,
  EdgeLabelRenderer,
  useReactFlow,
} from "reactflow";
import { BsX } from "react-icons/bs";

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { setEdges } = useReactFlow();
  const onEdgeClick = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          fill: "none",
          strokeWidth: 2,
          outline: "none",
          transition: "stroke 0.2s, fill 0.2s",
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {selected && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              pointerEvents: "all",
            }}
            className="nodrag nopan"
          >
            <Button
              className="edgebutton"
              onClick={onEdgeClick}
              size="xs"
              rounded="full"
              colorScheme="red"
              p={0}
            >
              <BsX size="xs" />
            </Button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default CustomEdge;
