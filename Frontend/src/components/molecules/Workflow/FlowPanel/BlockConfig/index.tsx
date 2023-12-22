import React from "react";
import { Node } from "reactflow";

interface BlockConfigProps {
  node: Node | null;
}

const BlockConfig: React.FC<BlockConfigProps> = ({ node }) => {
  return (
    <div>
      <h1>BlockConfig</h1>
      {JSON.stringify(node)}
    </div>
  );
};

export default BlockConfig;
