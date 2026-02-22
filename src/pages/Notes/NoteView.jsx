import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEASync } from "../../hooks/useEASync";
import { processNotionText } from "../../components/processNotionText";
import AppBar from "../../components/layout/AppBar";

const NoteView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: notes, save: saveNote } = useEASync("notes");
  const note = notes.find((n) => n.id === id);

  if (!note) return <div>Nota não encontrada</div>;

  const actions = [
    {
      icon: "✏️",
      label: "Editar",
      action: () => navigate(`/notes/edit/${id}`),
    },
    {
      icon: "🗑️",
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
      <AppBar actions={actions} />
      <div className="note-view-container">
        {/* <AppBar actions={actions} customTitle="Nota" /> */}
        <div className="note-meta">
          <h2>{note.title}</h2>
          <small>{note.clienteNome || "Nota Geral"}</small>
        </div>
        <div
          className="note-content-body"
          dangerouslySetInnerHTML={{ __html: processNotionText(note.content) }}
        />
      </div>
    </>
  );
};

export default NoteView;
