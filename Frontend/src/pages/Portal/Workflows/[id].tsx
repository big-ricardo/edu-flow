import ReactFlow from "@components/organisms/FlowBoard";
import { useParams } from "react-router-dom";

export default function Workflow() {
  const { id } = useParams<{ id: string }>();

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow />
    </div>
  );
}
