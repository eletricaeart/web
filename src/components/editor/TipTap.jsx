import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./TipTap.css";

const TipTap = ({ value, onChange, bg = "#f5f5f5", radius = "9px" }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    // Dispara o onChange sempre que o texto mudar
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (onChange) onChange(html);
    },
    editorProps: {
      attributes: {
        class: "tiptap-input-field", // Classe para o seu CSS
      },
    },
  });

  // Sincroniza o valor se ele mudar externamente (ex: ao carregar um orçamento)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div
      className="tiptap-wrapper"
      style={{
        background: bg,
        borderRadius: radius,
        padding: "12px",
        border: "1px solid #ddd",
      }}
    >
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTap;
