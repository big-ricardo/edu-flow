import React, { useCallback, useEffect } from "react";
import grapesjs from "grapesjs";
import Editor = grapesjs.Editor;
import newsletter from "grapesjs-preset-newsletter";
import customCode from "grapesjs-custom-code";
import parserPostcss from "grapesjs-parser-postcss";
import pluginExport from "grapesjs-plugin-export";
import pluginJsTable from "grapesjs-table";

interface EmailTemplateHookProps {
  data: string;
}

export default function EmailTemplateHook({ data }: EmailTemplateHookProps) {
  const [editor, setEditor] = React.useState<Editor | null>(null);

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
  }, [data, setEditor]);

  const handleSave = useCallback(() => {
    if (editor) {
      const html = editor.getHtml();

      return html;
    }

    return "";
  }, [editor]);

  return { handleSave };
}
