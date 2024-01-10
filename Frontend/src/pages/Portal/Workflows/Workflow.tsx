import FlowBoard from "@components/organisms/Workflow/FlowBoard";
import FlowDrawer from "@components/organisms/Workflow/FlowDrawer";
import DrawerContext from "@contexts/DrawerContext";
import { ReactFlowProvider } from "reactflow";

export default function Workflow() {

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlowProvider>
        <DrawerContext>
          <FlowBoard />
          <FlowDrawer />
        </DrawerContext>
      </ReactFlowProvider>
    </div>
  );
}
