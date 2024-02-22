import { Box, Text } from "@chakra-ui/react";
import React from "react";

import "grapesjs/dist/css/grapes.min.css";

interface MdxEditorProps {}

const MdxEditor: React.FC<MdxEditorProps> = () => {
  return (
    <Box h="100%">
      <Text mb={4}>Layout</Text>
      <div id="gjs" />
    </Box>
  );
};

export default MdxEditor;
