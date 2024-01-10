import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import grapesjs from "grapesjs";
import newsletter from "grapesjs-preset-newsletter";
import customCode from "grapesjs-custom-code";
import parserPostcss from "grapesjs-parser-postcss";
import pluginExport from "grapesjs-plugin-export";
import pluginJsTable from "grapesjs-table";
import { useNavigate } from "react-router-dom";

import "grapesjs/dist/css/grapes.min.css";
import Editor = grapesjs.Editor;

interface MdxEditorProps {
  onSave?: (html: string) => void;
  data?: string;
  isPending?: boolean;
}

const MdxEditor: React.FC<MdxEditorProps> = ({ onSave, data, isPending }) => {
  const navigate = useNavigate();
  const [editor, setEditor] = useState<Editor | null>(null);

  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    const grapesJsEditor = grapesjs.init({
      container: "#gjs",
      height: "100vh",
      width: "100%",
      fromElement: true,
      plugins: [
        newsletter,
        customCode,
        parserPostcss,
        pluginExport,
        pluginJsTable,
      ],
    });

    grapesJsEditor.on("load", () => {
      if (data) {
        grapesJsEditor.DomComponents.clear();
        grapesJsEditor.addComponents(data, {});
      } else {
        grapesJsEditor.DomComponents.clear();
      }
    });

    setEditor(grapesJsEditor);
  }, [data]);

  const handleSave = useCallback(() => {
    if (editor) {
      const html = editor.getHtml();

      onSave?.(html);
    }
  }, [editor, onSave]);

  return (
    <Box h="100%">
      <Text mb={4}>Layout</Text>
      <div id="gjs" />
      <Flex justifyContent="flex-end" mt={4}>
        <Button mr={4} colorScheme="red" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave} colorScheme="green" isLoading={isPending}>
          Salvar
        </Button>
      </Flex>
    </Box>
  );
};

export default MdxEditor;
