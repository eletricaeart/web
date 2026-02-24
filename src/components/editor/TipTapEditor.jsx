import React, { useEffect } from "react";

import { useEditor, EditorContent, ReactRenderer } from "@tiptap/react";
import { Extension } from "@tiptap/core";

import { StarterKit } from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
// import { Placeholder } from "@tiptap/extension-placeholder";
import { Placeholder } from "@tiptap/extensions";

// import { BubbleMenu } from "@tiptap/extension-bubble-menu";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";

// import Suggestion from "@tiptap/suggestion";
import tippy from "tippy.js";

// import CommandList from "./CommandList";
import "./TipTapEditor.css";

import { Image } from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";

// Extensão de Slash Commands configurada fora para evitar recriação
const SlashCommands = Extension.create({
  name: "slash-commands",
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: "/",
        items: ({ query }) => {
          return [
            {
              title: "Título 1",
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setNode("heading", { level: 1 })
                  .run();
              },
            },
            {
              title: "Título 2",
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setNode("heading", { level: 2 })
                  .run();
              },
            },
            {
              title: "Lista",
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleBulletList()
                  .run();
              },
            },
            {
              title: "Citação",
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleBlockquote()
                  .run();
              },
            },
            {
              title: "Inserir Imagem",
              command: ({ editor, range }) => {
                const url = window.prompt("Cole a URL da imagem:");
                if (url) {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setImage({ src: url })
                    .run();
                }
              },
            },
            {
              title: "Tabela 3x3",
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                  .run();
              },
            },
          ].filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase()),
          );
        },
        render: () => {
          let component;
          let popup;
          return {
            onStart: (props) => {
              component = new ReactRenderer(CommandList, {
                props,
                editor: props.editor,
              });
              popup = tippy(document.body, {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
              });
            },
            onUpdate(props) {
              component.updateProps(props);
              popup[0].setProps({
                getReferenceClientRect: props.clientRect,
              });
            },
            onKeyDown(props) {
              if (props.event.key === "Escape") {
                popup[0].hide();
                return true;
              }
              return component.ref?.onKeyDown(props);
            },
            onExit() {
              popup[0].destroy();
              component.destroy();
            },
          };
        },
      }),
    ];
  },
});

const TipTapEditor = ({
  value,
  onChange,
  placeholder = "Digite aqui...",
  bg = "#f5f5f5",
  radius = "9px",
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
        blockquote: {},
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({ placeholder }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      // SlashCommands,

      BubbleMenu, // ⚠️ AGORA PRECISA ESTAR AQUI
    ],

    content: value || "",

    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div
      className="tiptap-container"
      style={{
        background: bg,
        borderRadius: radius,
        padding: "8px",
        border: "1px solid #e2e8f0",
      }}
    >
      <BubbleMenu editor={editor}>
        <div className="flex gap-1 bg-gray-900 p-1 rounded-md shadow-xl border border-gray-700">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-2 py-1 text-xs font-bold ${editor.isActive("bold") ? "text-orange-400" : "text-white"}`}
          >
            B
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setColor("#ef4444").run()}
            className="px-2 py-1 text-xs text-red-500 font-bold"
          >
            A
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHighlight({ color: "#ffab00" }).run()
            }
            className="px-2 py-1 text-xs text-orange-400 font-bold"
          >
            H
          </button>
        </div>
      </BubbleMenu>

      <EditorContent
        editor={editor}
        className="outline-none min-h-[auto] prose prose-sm max-w-none"
      />
    </div>
  );
};

export default TipTapEditor;
