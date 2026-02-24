import React, { useEffect, useMemo } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

const BlockNoteTest = ({
  value,
  onChange,
  placeholder,
  bg = "#fff0",
  radius = "0",
}) => {
  // Inicializa o editor
  const editor = useCreateBlockNote();

  // Sincroniza o valor inicial apenas uma vez ou quando mudar externamente
  // Nota: BlockNote trabalha melhor com conversão de HTML para blocos
  useEffect(() => {
    async function loadContent() {
      if (
        value &&
        editor.document.length === 1 &&
        editor.document[0].content.length === 0
      ) {
        const blocks = await editor.tryParseHTMLToBlocks(value);
        editor.replaceBlocks(editor.document, blocks);
      }
    }
    loadContent();
  }, [value, editor]);

  const handleEditorChange = async () => {
    // Converte os blocos para HTML para manter compatibilidade com seu GAS
    const html = await editor.blocksToFullHTML(editor.document);
    if (onChange) onChange(html);
  };

  return (
    <div
      className="blocknote-host"
      style={{
        background: bg,
        borderRadius: radius,
        padding: "8px",
        minHeight: "100px",
        border: "1px solid #e5e5e5",
      }}
    >
      <BlockNoteView
        editor={editor}
        onChange={handleEditorChange}
        theme="light"
      />
    </div>
  );
};

export default BlockNoteTest;
