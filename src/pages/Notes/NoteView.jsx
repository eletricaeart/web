import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEASync } from "../../hooks/useEASync";
import { processNotionText } from "../../components/processNotionText";
import AppBar from "../../components/layout/AppBar";
import View from "../../components/layout/View";
import { NotePencil, Trash } from "@phosphor-icons/react/dist/ssr";

/**
 * --- [ default: NoteView ]
 *  */
export default function NoteView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: notes, save: saveNote } = useEASync("notes");
  const note = notes.find((n) => n.id === id);

  if (!note) return <div>Nota não encontrada</div>;

  const appbarActions = [
    {
      icon: <NotePencil size={28} weight="duotone" />,
      label: "Editar",
      action: () => navigate(`/notes/edit/${id}`),
    },
    {
      icon: <Trash size={28} weight="duotone" />,
      label: "Apagar",
      action: async () => {
        if (window.confirm("Apagar permanentemente?")) {
          await saveNote({ id }, "delete");
          navigate("/notes");
        }
      },
    },
  ];

  return (
    <>
      <AppBar actions={appbarActions} title="Anotação" />
      <View tag="note" className="note-view-container">
        <div className="note-meta">
          <h2>{note.title}</h2>
          <small>{note.clienteNome || "Nota Geral"}</small>
        </div>
        <div
          className="note-content-body"
          dangerouslySetInnerHTML={{ __html: processNotionText(note.content) }}
        />
      </View>
    </>
  );
}
