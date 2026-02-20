import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEASync } from "../../hooks/useEASync";
import FAB from "../../components/layout/FAB";
import "./Clientes.css";
import View from "../../components/layout/View";
import SearchBar from "../../components/SearchBar/SearchBar";
import ClientCard from "../../components/layout/ClientCard/ClientCard";
import { DotsThreeOutlineVertical } from "@phosphor-icons/react";

export default function ClientesLista() {
  // estado para controlar o menu ativo
  const [activeMenu, setActiveMenu] = useState(null);

  const navigate = useNavigate();
  const { data: allClients, pull: syncClients } = useEASync("clients");
  const [term, setTerm] = useState("");

  const AVATARS = {
    masc: "../../../public/pix/avatar/default_avatar_masc.webp",
    fem: "/public/pix/avatar/default_avatar_fem.webp",
  };

  const handleDeleteQuick = async (id, name) => {
    if (window.confirm(`Excluir ${name}?`)) {
      await saveClient({ id }, "delete");
      setActiveMenu(null);
    }
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
      <View tag="clients-list">
        <div className="clients-container">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="client-card-wrapper"
              style={{ position: "relative" }}
            >
              <ClientCard
                client={c}
                AVATARS={AVATARS}
                onClick={() => navigate(`/cliente?id=${c.id}`)}
              />

              {/* Menu de opções rápidas idêntico ao de Orçamentos */}
              <div
                className="options-container"
                style={{ position: "absolute", right: "15px", top: "35%" }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(activeMenu === c.id ? null : c.id);
                  }}
                  style={{ background: "none", border: "none", color: "#777" }}
                >
                  <DotsThreeOutlineVertical size={24} weight="duotone" />
                </button>

                {activeMenu === c.id && (
                  <div
                    className="options-menu active"
                    style={{
                      position: "absolute",
                      top: "30px",
                      right: "0",
                      zIndex: "100",
                      background: "white",
                      borderRadius: "10px",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                      minWidth: "120px",
                      overflow: "hidden",
                      border: "1px solid #eee",
                    }}
                  >
                    <button
                      className="menu-item delete"
                      onClick={() => handleDeleteQuick(c.id, c.name)}
                      style={{
                        padding: "10px",
                        width: "100%",
                        border: "none",
                        color: "#ff4444",
                        background: "none",
                        textAlign: "left",
                      }}
                    >
                      <Trash
                        size={18}
                        weight="duotone"
                        style={{ marginRight: "8px" }}
                      />{" "}
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <FAB config={fabConfig} />
      </View>
    </>
  );
}
