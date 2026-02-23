import React from "react";
import View from "../View";
import "./ClientCard.css";

/**
 * Componente de Card para Listagem de Clientes
 * @param {Object} client - Objeto com os dados do cliente (id, name, gender, cidade, doc)
 * @param {Function} onClick - Função disparada ao clicar no card
 */
export default function ClientCard({ client, onClick, AVATARS, options }) {
  const AVATARS_fallback = {
    masc: "/assets/imgs/avatar/default_avatar_masc.webp",
    fem: "/assets/imgs/avatar/default_avatar_fem.webp",
  };

  return (
    <View tag="client-card">
      <View tag="client-avatar" onClick={onClick}>
        <img
          src={AVATARS[client.gender] || AVATARS.masc}
          alt={`Avatar de ${client.name}`}
        />
      </View>

      <View tag="client-info" onClick={onClick}>
        <h4 className="text-[#333] capitalize">{client.name}</h4>
        <p>{client.cidade || "Cidade não informada"}</p>
      </View>

      {/* <View tag="client-badge">{client.doc ? "DOC OK" : "S/ DOC"}</View> */}
      <View tag="client-badge">{options}</View>
    </View>
  );
}
