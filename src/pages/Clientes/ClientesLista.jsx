import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEASync } from "../../hooks/useEASync";
import FAB from "../../components/layout/FAB";
import "./Clientes.css";
import View from "../../components/layout/View";
import SearchBar from "../../components/SearchBar/SearchBar";
import ClientCard from "../../components/layout/ClientCard/ClientCard";

export default function ClientesLista() {
  const navigate = useNavigate();
  const { data: allClients, pull: syncClients } = useEASync("clients");
  const [term, setTerm] = useState("");

  const AVATARS = {
    masc: "/assets/imgs/avatar/default_avatar_masc.webp",
    fem: "/assets/imgs/avatar/default_avatar_fem.webp",
  };

  const filtered = allClients.filter(
    (c) =>
      c.name.toLowerCase().includes(term.toLowerCase()) ||
      (c.doc && c.doc.includes(term)),
  );

  const fabConfig = [
    { icon: "👤+", label: "Novo Cliente", action: () => navigate("/cliente") },
    { icon: "🔄", label: "Sincronizar", action: () => syncClients() },
  ];

  return (
    <>
      <SearchBar
        placeholder="Buscar cliente por nome ou documento..."
        onSearch={(val) => setTerm(val)}
        value={term}
      />
      {/* <div className="search-bar-container">
      //   <input
      //     type="text"
      //     placeholder="Buscar cliente..."
      //     className="search-input"
      //     value={term}
      //     onChange={(e) => setTerm(e.target.value)}
      //   />
      // </div>*/}

      <View tag="clients-list">
        <div className="clients-container">
          {filtered.map((c) => (
            <ClientCard
              key={c.id}
              client={c}
              onClick={() => navigate(`/cliente?id=${c.id}`)}
            />
          ))}
        </div>
        <FAB config={fabConfig} />
      </View>
    </>
  );
}
