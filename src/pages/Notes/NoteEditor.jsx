import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEASync } from "../../hooks/useEASync";
import TipTapEditor from "../../components/editor/TipTapEditor";
import AppBar from "../../components/layout/AppBar";
import View from "@/components/layout/View";
import { CircleNotch } from "@phosphor-icons/react";

export default function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: notes, save: saveNote } = useEASync("notes");

  // Estado para controlar o carregamento
  const [loading, setLoading] = useState(false);

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
    if (loading) return; // Proteção extra

    setLoading(true); // Inicia a animação de loading

    try {
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

      if (res.success) {
        navigate("/notes");
      }
    } catch (error) {
      console.error("Erro ao salvar nota:", error);
    } finally {
      // Opcional: só resetamos o loading se não houver redirecionamento
      setLoading(false);
    }
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
        style={{
          padding: "1rem",
          background: "white",
          minHeight: "calc(100vh - 128px - 4rem)",
        }}
      >
        <input
          className="note-title-input"
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            border: "none",
            width: "100%",
            outline: "none",
            marginBottom: "1rem",
            color: "#333",
          }}
          value={noteData.title}
          placeholder="Título da nota"
          disabled={loading} // Desabilita o título durante o salvamento
          onChange={(e) => setNoteData({ ...noteData, title: e.target.value })}
        />

        <TipTapEditor
          value={noteData.content}
          onChange={(val) => setNoteData({ ...noteData, content: val })}
          placeholder="Comece a escrever sua nota técnica..."
          bg="#f5f5f5"
          radius=".7rem"
        />
      </View>
      <View
        tag="editor-footer"
        style={{
          display: "grid",
          placeItems: "center",
          height: "calc(56px + 4rem)",
          padding: "2rem",
        }}
      >
        <button
          className="btn-save-full"
          onClick={handleSave}
          disabled={loading} // Desabilita o clique físico
          style={{
            width: "100%",
            padding: "15px",
            background: loading ? "#94a3b8" : "var(--sv-sodalita, #1a237e)", // Cor de desabilitado
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
            opacity: loading ? 0.8 : 1,
          }}
        >
          {loading ? (
            <>
              <CircleNotch size={24} weight="bold" className="animate-spin" />
              <span>SALVANDO...</span>
            </>
          ) : id ? (
            "ATUALIZAR NOTA"
          ) : (
            "SALVAR NOTA"
          )}
        </button>
      </View>
    </>
  );
}
