import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEASync } from "../../hooks/useEASync";
import EANotionEditor from "../../components/EANotionEditor";
import AppBar from "../../components/layout/AppBar";

const NoteEditor = () => {
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
    const payload = {
      ...noteData,
      id: id || crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    const res = await saveNote(payload, id ? "update" : "create");
    if (res.success) navigate("/notes");
  };

  return (
    <>
      <AppBar customTitle={id ? "Editar Nota" : "Nova Nota"} />
      <div
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
      </div>
    </>
  );
};

export default NoteEditor;
