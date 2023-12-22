import { Box, Button, Flex } from "@chakra-ui/react";
import React, { useCallback, useRef } from "react";
import EmailEditor, { EditorRef, EmailEditorProps } from "react-email-editor";
import { useNavigate } from "react-router-dom";

interface MdxEditorProps {
  markdown?: string;
}

const MdxEditor: React.FC<MdxEditorProps> = () => {
  const emailEditorRef = useRef<EditorRef>(null);
  const navigate = useNavigate();

  const onReady: EmailEditorProps["onReady"] = () => {};

  const handleSave = useCallback(() => {
    const unlayer = emailEditorRef.current?.editor;
    unlayer?.exportHtml((data) => {
      const { design, html } = data;
      console.log("exportHtml", html);
      console.log("exportHtmlDesign", design);
    });
  }, []);

  const handleCancel = useCallback(() => {
    navigate(-1);
  }, []);

  return (
    <Box h="100%">
      <Flex justifyContent="flex-end" mb={4}>
        <Button mr={4} colorScheme="red" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave} colorScheme="green">
          Salvar
        </Button>
      </Flex>

      <EmailEditor ref={emailEditorRef} onReady={onReady} minHeight={"800px"} />
    </Box>
  );
};

export default MdxEditor;
