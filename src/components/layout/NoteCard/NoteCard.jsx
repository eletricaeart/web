import React from "react";
import { processNotionText } from "../../processNotionText";
import View from "../View";
import "./NoteCard.css";

/**
 * Componente de Card para Notas Técnicas
 * @param {Object} note - Objeto contendo id, title e content
 * @param {Function} onClick - Função de navegação ao clicar no card
 */
export default function NoteCard({ note, onClick }) {
  return (
    <View
      tag="note-card"
      className="note-card"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <View className="title">
        <strong>{note.title || "Sem título"}</strong>
        <small className="subtitle">{"15/02/2026"}</small>
      </View>

      <View
        tag="note-preview"
        dangerouslySetInnerHTML={{
          __html: processNotionText(note.content?.substring(0, 100)),
        }}
      />
    </View>
  );
}
