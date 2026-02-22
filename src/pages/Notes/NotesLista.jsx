import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEASync } from "../../hooks/useEASync";
import { processNotionText } from "../../components/processNotionText";
import FAB from "../../components/layout/FAB";
import "./Notes.css";
import View from "../../components/layout/View";
import { Search } from "lucide-react";
import AppBar from "../../components/layout/AppBar";
import SearchBar from "../../components/SearchBar/SearchBar";
import NoteCard from "../../components/layout/NoteCard/NoteCard";

export default function NotesLista() {
  const navigate = useNavigate();
  const { data: allNotes, pull: syncNotes } = useEASync("notes");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNotes = allNotes
    .filter(
      (n) =>
        n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .reverse();

  return (
    <>
      <AppBar customTitle="Anotações" />
      <SearchBar
        placeholder="Buscar em notas..."
        onSearch={(val) => setSearchTerm(val)}
      />

      <View tag="main">
        <View tag="notes-list" className="notes-grid">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onClick={() => navigate(`/notes/view/${note.id}`)}
            />
          ))}
        </View>
      </View>

      <FAB
        config={[
          {
            icon: "✍️",
            label: "Nova Nota",
            action: () => navigate("/notes/new"),
          },
          { icon: "🔄", label: "Sincronizar", action: () => syncNotes() },
        ]}
      />
    </>
  );
}

const styles = {
  notesListBody: {
    flexDirection: "column",
    padding: "0 1rem 150px",
    transition: "all 0.3s ease",

    display: "grid",
    gridTemplateColumns: "45% 45%",
    paddingTop: "0",
    paddingRight: "0",
    paddingBottom: "150px",
    paddingLeft: "0",
    gap: "10px",
    justifyContent: "center",
  },
};
