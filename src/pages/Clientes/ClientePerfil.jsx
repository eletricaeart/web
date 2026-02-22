import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEASync } from "../../hooks/useEASync";
import AppBar from "../../components/layout/AppBar";
import "./Clientes.css";
import { Pen, Trash, FilePlus } from "@phosphor-icons/react";

/**
 * --- [ default: ClientePerfil ]
 *  */
export default function ClientePerfil() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const clientId = searchParams.get("id");

  // Hooks para todas as entidades necessárias
  const { data: clients, save: saveClient } = useEASync("clients");
  const { data: orcamentos } = useEASync("orcamentos");
  const { data: notes } = useEASync("notes");

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
      const client = clients.find((c) => String(c.id) === String(clientId));
      if (client) {
        setFormData({
          ...client,
          cep: client.address?.cep || "",
          rua: client.address?.rua || "",
          num: client.address?.num || "",
          bairro: client.address?.bairro || "",
          cidade: client.address?.cidade || "",
        });
      }
    }
  }, [clientId, clients]);

  // Filtros de Histórico
  const historicoOrcamentos = orcamentos
    .filter((o) => o.cliente.name === formData.name)
    .reverse();
  const historicoNotas = notes
    .filter((n) => n.clienteNome === formData.name)
    .reverse();

  const handleSave = async () => {
    /*const action = clientId ? "update" : "create";
    const payload = { ...formData, id: clientId || "CL-" + Date.now() };
    const res = await saveClient(payload, action);
    if (res.success) setIsEditing(false);*/
    const action = clientId ? "update" : "create";

    const payload = {
      id: clientId || `TEMP_${Date.now()}`,
      name: formData.name,
      gender: formData.gender,
      doc: formData.doc,
      whatsapp: formData.whatsapp,
      email: formData.email,
      address: {
        cep: formData.cep,
        rua: formData.rua,
        num: formData.num,
        bairro: formData.bairro,
        cidade: formData.cidade,
      },
    };

    const res = await saveClient(payload, action);
    if (res.success) setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm(`Excluir o cliente ${formData.name}?`)) {
      // Garantimos que passamos apenas o objeto necessário para o delete
      const res = await saveClient({ id: formData.id || clientId }, "delete");
      if (res.success) {
        navigate("/clientes");
      } else {
        alert("Erro ao excluir cliente: " + res.error);
      }
    }
  };

  const appBarActions =
    clientId && !isEditing
      ? [
          {
            icon: <Pen size={28} weight="duotone" />,
            label: "Editar",
            action: () => navigate(`/cliente/editar?id=${clientId}`),
          },
          {
            icon: <Trash size={28} weight="duotone" />,
            label: "Excluir",
            action: handleDelete,
          }, // Nova ação de exclusão
          {
            icon: <FilePlus size={28} weight="duotone" />,
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
        backAction={() => navigate(-1)}
        actions={appBarActions}
        customTitle={isEditing ? "Editar Cliente" : "Perfil"}
      />

      <div className="avatar-section">
        <div className="avatar-circle">
          <img
            src={`/pix/avatar/default_avatar_${formData.gender}.webp`}
            alt="Avatar"
          />
        </div>
        <h2>{formData.name || "Novo Cliente"}</h2>
      </div>

      <div className="form-container" style={{ padding: "0 1rem 120px" }}>
        {/* CARD: DADOS BÁSICOS E CONTATO */}
        <div className="card-ea">
          <div className="card-ea-header">INFORMAÇÕES GERAIS</div>
          <div className="card-ea-body">
            <label>Nome / WhatsApp</label>
            <p>
              <strong>{formData.name}</strong> —{" "}
              {formData.whatsapp || "S/ WhatsApp"}
            </p>
            <label>Documento (CPF/CNPJ)</label>
            <p>{formData.doc || "Não informado"}</p>
          </div>
        </div>

        {/* CARD: ENDEREÇO (Ajustado bairro/cidade) */}
        <div className="card-ea">
          <div className="card-ea-header">ENDEREÇO</div>
          <div className="card-ea-body">
            <label>Logradouro</label>
            <p>
              {formData.rua}, {formData.num}
            </p>
            <label>Bairro / Cidade</label>
            <p>
              {formData.bairro} — {formData.cidade}
            </p>
            <label>CEP</label>
            <p>{formData.cep}</p>
          </div>
        </div>

        {/* SEÇÃO: HISTÓRICO DE ORÇAMENTOS */}
        <div className="card-ea">
          <div className="card-ea-header">HISTÓRICO DE ORÇAMENTOS</div>
          <div className="card-ea-body">
            {historicoOrcamentos.length > 0 ? (
              historicoOrcamentos.map((o) => (
                <div
                  key={o.id}
                  className="history-item"
                  onClick={() => navigate(`/orcamento?id=${o.id}`)}
                >
                  <span>{o.docTitle.emissao}</span>
                  <p>{o.docTitle.text}</p>
                </div>
              ))
            ) : (
              <p className="empty-text">Nenhum orçamento para este cliente.</p>
            )}
          </div>
        </div>

        {/* SEÇÃO: HISTÓRICO DE NOTAS */}
        <div className="card-ea">
          <div className="card-ea-header">NOTAS TÉCNICAS</div>
          <div className="card-ea-body">
            {historicoNotas.length > 0 ? (
              historicoNotas.map((n) => (
                <div
                  key={n.id}
                  className="history-item"
                  onClick={() => navigate(`/notes/view/${n.id}`)}
                >
                  <span>{new Date(n.date).toLocaleDateString("pt-BR")}</span>
                  <p>{n.title}</p>
                </div>
              ))
            ) : (
              <p className="empty-text">Nenhuma nota vinculada.</p>
            )}
          </div>
        </div>

        {isEditing && (
          <footer className="footer-btn">
            <button className="btn-save" onClick={handleSave}>
              SALVAR ALTERAÇÕES
            </button>
            {clientId && (
              <button
                className="btn-cancel"
                onClick={() => setIsEditing(false)}
              >
                CANCELAR
              </button>
            )}
          </footer>
        )}
      </div>
    </>
  );
}
