import React, { useCallback, useEffect } from "react";
import grapesjs from "grapesjs";
import Editor = grapesjs.Editor;
import newsletter from "grapesjs-preset-newsletter";
import customCode from "grapesjs-custom-code";
import parserPostcss from "grapesjs-parser-postcss";
import pluginExport from "grapesjs-plugin-export";
// @ts-ignore
import pluginJsTable from "grapesjs-table";

interface EmailTemplateHookProps {
  html?: string;
  css?: string;
}

export default function EmailTemplateHook({ html, css }: EmailTemplateHookProps) {
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
      if (html) {
        grapesJsEditor.DomComponents.clear();
        grapesJsEditor.addComponents(html, {});
      } 

      if (css) {
        grapesJsEditor.CssComposer.clear();
        grapesJsEditor.addStyle(css);
      }
    });

    setEditor(grapesJsEditor);
  }, [html, css]);

  const handleSave = useCallback(() => {
    if (editor) {
      const html = editor.getHtml();
      const css = editor.getCss();

      return { html, css };
    }

    return { html: "", css: "" };
  }, [editor]);

  return { handleSave };
}
