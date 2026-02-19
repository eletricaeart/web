import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEASync } from "../../hooks/useEASync";
import AppBar from "../../components/layout/AppBar";
import "./Clientes.css";

const ClientePerfil = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const clientId = searchParams.get("id");

  const { data: clients, save: saveClient } = useEASync("clients");
  const { data: orcamentos } = useEASync("orcamentos");

  const [isEditing, setIsEditing] = useState(!clientId);
  const [formData, setFormData] = useState({
    name: "",
    gender: "masc",
    doc: "",
    whatsapp: "",
    email: "",
    cep: "",
    rua: "",
    num: "",
    bairro: "",
    cidade: "",
  });

  useEffect(() => {
    if (clientId) {
      const client = clients.find((c) => c.id === clientId);
      if (client) setFormData(client);
    }
  }, [clientId, clients]);

  const handleSave = async () => {
    const action = clientId ? "update" : "create";
    const payload = { ...formData, id: clientId || crypto.randomUUID() };
    const res = await saveClient(payload, action);
    if (res.success) setIsEditing(false);
  };

  // Menu dinâmico para a AppBar
  const appBarActions =
    clientId && !isEditing
      ? [
          { icon: "✏️", label: "Editar", action: () => setIsEditing(true) },
          {
            icon: "📄",
            label: "Novo Orçamento",
            action: () => {
              localStorage.setItem(
                "ea_selected_client",
                JSON.stringify(formData),
              );
              navigate("/captura?restore=true");
            },
          },
        ]
      : [];

  return (
    <>
      <AppBar
        actions={appBarActions}
        customTitle={isEditing ? "Editar Cliente" : "Perfil"}
      />

      <div className="avatar-section">
        <div className="avatar-circle">
          <img
            // src={`/assets/imgs/avatar/default_avatar_${formData.gender}.webp`}
            src={`/public/pix/avatar/default_avatar_${formData.gender}.webp`}
            alt="Avatar"
          />
        </div>
        <h2>{formData.name || "Novo Cliente"}</h2>
      </div>

      <div className="form-container">
        <div className="card-ea">
          <div className="card-ea-header">DADOS BÁSICOS</div>
          <div className="card-ea-body">
            {isEditing ? (
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Nome Completo"
              />
            ) : (
              <p>
                <strong>{formData.name}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Adicionar aqui os outros cards seguindo o mesmo padrão de isEditing */}

        {isEditing && (
          <footer className="footer-btn">
            <button className="btn-save" onClick={handleSave}>
              SALVAR ALTERAÇÕES
            </button>
            {clientId && (
              <button onClick={() => setIsEditing(false)}>CANCELAR</button>
            )}
          </footer>
        )}
      </div>
    </>
  );
};

export default ClientePerfil;
