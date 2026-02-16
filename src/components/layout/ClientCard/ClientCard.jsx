import React from "react";
import View from "../View";
import "./ClientCard.css";

/**
 * Componente de Card para Listagem de Clientes
 * @param {Object} client - Objeto com os dados do cliente (id, name, gender, cidade, doc)
 * @param {Function} onClick - Função disparada ao clicar no card
 */
export default function ClientCard({ client, onClick }) {
  const AVATARS = {
    masc: "/assets/imgs/avatar/default_avatar_masc.webp",
    fem: "/assets/imgs/avatar/default_avatar_fem.webp",
  };

  return (
    <View tag="client-card" onClick={onClick}>
      <View tag="client-avatar">
        <img
          src={AVATARS[client.gender] || AVATARS.masc}
          alt={`Avatar de ${client.name}`}
        />
      </View>

      <View tag="client-info">
        <h4>{client.name}</h4>
        <p>{client.cidade || "Cidade não informada"}</p>
      </View>

      <View tag="client-badge">{client.doc ? "DOC OK" : "S/ DOC"}</View>
    </View>
  );
}
