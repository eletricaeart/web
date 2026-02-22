import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEASync } from "../../hooks/useEASync";
import EANotionEditor from "../../components/EANotionEditor";
import AppBar from "../../components/layout/AppBar";
import View from "@/components/layout/View";

/**
 * --- [ default: NoteEditor ]
 *  */
export default function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: notes, save: saveNote } = useEASync("notes");

  const [noteData, setNoteData] = useState({
    title: "",
    content: "",
    clienteNome: "",
  });

  useEffect(() => {
    if (id) {
      const existing = notes.find((n) => n.id === id);
      if (existing) setNoteData(existing);
    }
  }, [id, notes]);

  const handleSave = async () => {
    const action = id ? "update" : "create";

    const payload = {
      id: id || `TEMP_${Date.now()}`,
      date: new Date().toISOString(),
      title: noteData.title,
      content: noteData.content,
      clienteId: noteData.clienteId || "",
      clienteNome: noteData.clienteNome || "",
    };

    const res = await saveNote(payload, action);

    if (res.success) navigate("/notes");
  };

  return (
    <>
      <AppBar
        title={id ? "Editar Nota" : "Nova Nota"}
        backAction={() => navigate(-1)}
      />
      <View
        tag="note-editor"
        className="editor-container"
        style={{ padding: "1rem", background: "white" }}
      >
        <input
          className="note-title-input"
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            border: "none",
            width: "100%",
            outline: "none",
          }}
          value={noteData.title}
          placeholder="Título da nota"
          onChange={(e) => setNoteData({ ...noteData, title: e.target.value })}
        />
        <EANotionEditor
          value={noteData.content}
          onChange={(val) => setNoteData({ ...noteData, content: val })}
          placeholder="Comece a escrever..."
        />
        <button
          className="btn-save-full"
          onClick={handleSave}
          style={{ marginTop: "20px" }}
        >
          {id ? "ATUALIZAR" : "SALVAR NOTA"}
        </button>
      </View>
    </>
  );
}
