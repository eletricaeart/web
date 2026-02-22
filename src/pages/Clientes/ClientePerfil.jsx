import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEASync } from "../../hooks/useEASync";
import AppBar from "../../components/layout/AppBar";
import "./Clientes.css";
import { Pen, Trash, FilePlus } from "@phosphor-icons/react";
import View from "@/components/layout/View";
import { getCleanDate } from "../../utils/helpers";
import Divider from "@/components/ui/divider";

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
          // Prioriza dados na raiz (vinda do GS) e cai para .address se necessário
          cep: client.cep || client.address?.cep || "",
          rua: client.rua || client.address?.rua || "",
          num: client.num || client.address?.num || "",
          bairro: client.bairro || client.address?.bairro || "",
          cidade: client.cidade || client.address?.cidade || "",
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
    const action = clientId ? "update" : "create";

    const payload = {
      id: clientId || `TEMP_${Date.now()}`,
      name: formData.name,
      gender: formData.gender,
      doc: formData.doc,
      whatsapp: formData.whatsapp,
      email: formData.email,
      // Envie os dados na raiz para coincidir com as colunas da planilha
      cep: formData.cep,
      rua: formData.rua,
      num: formData.num,
      bairro: formData.bairro,
      cidade: formData.cidade,
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
        <View className="card-ea">
          <div
            className="card-ea-header"
            style={{ textTransform: "uppercase" }}
          >
            Informações do cliente
          </div>
          <div className="card-ea-body">
            <p tag="titulo">
              <strong>Nome: </strong>
              {formData.name}
            </p>
            <p>
              <strong>WhatsApp: </strong>
              {formData.whatsapp || "S/ WhatsApp"}
            </p>
            <p>
              <strong>CPF/CNPJ: </strong>
              {formData.doc || "Não informado"}
            </p>
            <View tag="address">
              <strong>Endereço: </strong>
              <br />
              {formData.rua}, {formData.num} - {formData.bairro} -
              {formData.cidade} - {formData.cep}
            </View>
          </div>
        </View>

        {/* SEÇÃO: HISTÓRICO DE ORÇAMENTOS */}
        <div className="card-ea">
          <div className="card-ea-header">HISTÓRICO DE ORÇAMENTOS</div>
          <div className="card-ea-body">
            {historicoOrcamentos.length > 0 ? (
              historicoOrcamentos.map((o, i) => (
                <>
                  <View
                    tag="card-budget-hist"
                    key={o.id}
                    className="history-item flex items-center justify-between"
                    style={{}}
                    onClick={() => navigate(`/orcamento?id=${o.id}`)}
                  >
                    <p className="text-indigo-950 font-semibold">
                      {o.docTitle.text || "documento sem título"}
                    </p>
                    <span className="text-[#555]">
                      {getCleanDate(o.docTitle.emissao)}
                    </span>
                  </View>
                  {historicoOrcamentos.length - 1 != i && (
                    <Divider padding={"1rem"} />
                  )}
                </>
              ))
            ) : (
              <p className="empty-text">Nenhum orçamento para este cliente.</p>
            )}
          </div>
        </div>

        {/* SEÇÃO: HISTÓRICO DE NOTAS */}
        <div tag="card-notes-hist" className="card-ea">
          <div className="card-ea-header">NOTAS TÉCNICAS</div>
          <div className="card-ea-body">
            {historicoNotas.length > 0 ? (
              historicoNotas.map((n, i) => (
                <>
                  <div
                    key={n.id}
                    className="history-item"
                    onClick={() => navigate(`/notes/view/${n.id}`)}
                  >
                    <span>{new Date(n.date).toLocaleDateString("pt-BR")}</span>
                    <p>{n.title}</p>
                  </div>
                  {historicoNotas.lenght - 1 != i && <Divider padding="1rem" />}
                </>
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
