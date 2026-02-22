import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEASync } from "../../hooks/useEASync";
import FAB from "../../components/layout/FAB";
import AppBar from "../../components/layout/AppBar";
import BottomNavBar from "@/components/layout/BottomNavBar";
import "./Budget.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import {
  FilePlus,
  ArrowsCounterClockwise,
  Trash,
  CloudCheck,
  ArrowsClockwise,
  DotsThreeOutlineVertical,
  PencilSimple,
  Copy,
} from "@phosphor-icons/react";
import View from "@/components/layout/View";

/**
 * --- [ default: Budgets ]
 *  */
export default function Budgets() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  // Estado para controlar qual menu de card está aberto
  const [activeMenu, setActiveMenu] = useState(null);

  // Hooks de Dados
  const {
    data: orcamentos,
    save: saveOrcamento,
    pull: syncOrcamentos,
  } = useEASync("orcamentos");
  const { data: clientes } = useEASync("clients");

  const AVATARS = {
    masc: "/public/pix/avatar/default_avatar_masc.webp",
    fem: "/public/pix/avatar/default_avatar_fem.webp",
  };

  // Lógica de busca
  const filteredOrcamentos = orcamentos
    .filter(
      (orc) =>
        orc.cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orc.docTitle.text.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .reverse();

  // Configuração do FAB
  const fabConfig = [
    {
      icon: <FilePlus size={28} weight="duotone" />,
      label: "Novo Orçamento",
      action: () => navigate("/novo-orcamento"),
    },
    {
      icon: <ArrowsCounterClockwise size={28} weight="duotone" />,
      label: "Sincronizar",
      action: () => syncOrcamentos(),
    },
  ];

  const handleDelete = async (id, name) => {
    // Aqui usaríamos o EAModal (que converteremos para hook depois)
    const confirm = window.confirm(`Excluir orçamento de ${name}?`);
    if (confirm) {
      await saveOrcamento({ id }, "delete");
      setActiveMenu(null);
    }
  };

  const handleEdit = (orc) => {
    localStorage.setItem("edit_budget_data", JSON.stringify(orc));
    navigate("/novo-orcamento?edit=true");
  };

  const handleDuplicate = async (orc) => {
    const duplicated = { ...orc, id: "EA-" + Date.now() };
    await saveOrcamento(duplicated, "create");
    setActiveMenu(null);
  };

  return (
    <>
      <AppBar title="Orçamentos" />
      <View tag="budgets" className="dash-page">
        <SearchBar
          placeholder="Buscar cliente ou serviço..."
          onSearch={(val) => setSearchTerm(val)}
          value={searchTerm}
        />

        <main className="orcamento-list">
          {filteredOrcamentos.length > 0 ? (
            filteredOrcamentos.map((orc) => {
              const isTemp = String(orc.id).startsWith("TEMP_");
              const clientData = clientes.find(
                (c) => c.name === orc.cliente.name,
              );
              const avatarSrc = clientData
                ? AVATARS[clientData.gender]
                : AVATARS.masc;

              return (
                <div key={orc.id} className="orcamento-card">
                  <div className="client-avatar-dash">
                    <img src={avatarSrc} alt="Avatar" />
                  </div>

                  <div
                    className="info-content"
                    onClick={() => navigate(`/orcamento?id=${orc.id}`)}
                  >
                    <small style={{ color: "#999" }}>
                      {orc.docTitle.emissao}
                      <span className="sync-status">
                        {isTemp ? (
                          <ArrowsClockwise
                            size={16}
                            weight="bold"
                            color="#ffab00"
                          />
                        ) : (
                          <CloudCheck
                            size={16}
                            weight="duotone"
                            color="#4caf50"
                          />
                        )}
                      </span>
                    </small>
                    <h3>{orc.cliente.name}</h3>
                    <p>{orc.docTitle.text}</p>
                  </div>

                  {/* Novo Menu Dropdown implementado */}
                  <div
                    className="options-container"
                    style={{ position: "relative" }}
                  >
                    {!isTemp && (
                      <>
                        <button
                          className="btn-options"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenu(
                              activeMenu === orc.id ? null : orc.id,
                            );
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#777",
                          }}
                        >
                          <DotsThreeOutlineVertical
                            size={24}
                            weight="duotone"
                          />
                        </button>

                        {activeMenu === orc.id && (
                          <div
                            className="options-menu active"
                            style={{
                              position: "absolute",
                              top: "35px",
                              right: "0",
                              background: "white",
                              borderRadius: "10px",
                              boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                              zIndex: "100",
                              minWidth: "150px",
                              overflow: "hidden",
                              border: "1px solid #eee",
                            }}
                          >
                            <button
                              className="menu-item"
                              onClick={() => handleEdit(orc)}
                              style={menuItemStyle}
                            >
                              <PencilSimple size={18} weight="duotone" /> Editar
                            </button>
                            <button
                              className="menu-item"
                              onClick={() => handleDuplicate(orc)}
                              style={menuItemStyle}
                            >
                              <Copy size={18} weight="duotone" /> Duplicar
                            </button>
                            <button
                              className="menu-item delete"
                              onClick={() =>
                                handleDelete(orc.id, orc.cliente.name)
                              }
                              style={{
                                ...menuItemStyle,
                                color: "#ff4444",
                                borderTop: "1px solid #f5f5f5",
                              }}
                            >
                              <Trash size={18} weight="duotone" /> Excluir
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ textAlign: "center", padding: "2rem", color: "#999" }}>
              Nenhum orçamento encontrado.
            </p>
          )}
        </main>
      </View>
      <FAB actions={fabConfig} hasBottomNav={true} />

      <BottomNavBar />
    </>
  );
}

const menuItemStyle = {
  padding: "12px 15px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  width: "100%",
  border: "none",
  background: "none",
  cursor: "pointer",
  textAlign: "left",
  fontFamily: "inherit",
  fontSize: "0.9rem",
  color: "#444",
};
