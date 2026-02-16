import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEASync } from "../../hooks/useEASync";
import AppBar from "../../components/layout/AppBar";
import View from "../../components/layout/View";
import "./Captura.css";

const CapturaOrcamento = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: orcamentos, save: saveOrcamento } = useEASync("orcamentos");
  const { data: clientes } = useEASync("clients");

  // 1. Estado dos campos de cabeçalho e cliente
  const [formData, setFormData] = useState({
    emissao: new Date().toISOString().split("T")[0],
    validade: "15 dias",
    cliente: {
      name: "",
      cep: "",
      rua: "",
      num: "",
      bairro: "",
      cidade: "",
    },
    docTitle: "",
    clauses: [], // Será trabalhado na próxima parte
  });

  const [cepLoading, setCepLoading] = useState(false);

  // 2. Lógica de busca de CEP
  const handleCepBlur = async (cepValue) => {
    const cep = cepValue.replace(/\D/g, "");
    if (cep.length === 8) {
      setCepLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const d = await res.json();
        if (!d.erro) {
          setFormData((prev) => ({
            ...prev,
            cliente: {
              ...prev.cliente,
              cep: cepValue,
              rua: d.logradouro,
              bairro: d.bairro,
              cidade: `${d.localidade} - ${d.uf}`,
            },
          }));
        }
      } catch (err) {
        console.error("Erro ao buscar CEP:", err);
      } finally {
        setCepLoading(false);
      }
    }
  };

  return (
    <div className="captura-container">
      <AppBar customTitle="Proposta de Orçamento" />

      <div className="container" style={{ padding: "20px", marginTop: "72px" }}>
        {/* Cabeçalho de Datas */}
        <div className="grid-row">
          <div className="form-group">
            <label>Data de Emissão</label>
            <input
              type="date"
              value={formData.emissao}
              onChange={(e) =>
                setFormData({ ...formData, emissao: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Validade da Proposta</label>
            <select
              value={formData.validade}
              onChange={(e) =>
                setFormData({ ...formData, validade: e.target.value })
              }
            >
              <option value="7 dias">7 dias</option>
              <option value="15 dias">15 dias</option>
              <option value="30 dias">30 dias</option>
            </select>
          </div>
        </div>

        {/* Identificação do Cliente */}
        <div className="form-group">
          <label
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Nome do Cliente / Empresa</span>
            <button
              className="label-help"
              style={{
                background: "#27f",
                color: "white",
                fontSize: "0.7rem",
                padding: "5px 10px",
              }}
              onClick={() => {
                /* Lógica de rascunho depois */ navigate("/cliente");
              }}
            >
              + NOVO CLIENTE
            </button>
          </label>
          <input
            type="text"
            placeholder="Digite o nome..."
            value={formData.cliente.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                cliente: { ...formData.cliente, name: e.target.value },
              })
            }
          />
        </div>

        {/* Endereço */}
        <div className="form-group">
          <label>
            CEP{" "}
            {cepLoading && (
              <span style={{ color: "green", fontSize: "0.7rem" }}>
                {" "}
                (Buscando...)
              </span>
            )}
          </label>
          <input
            type="text"
            placeholder="00000-000"
            value={formData.cliente.cep}
            onBlur={(e) => handleCepBlur(e.target.value)}
            onChange={(e) =>
              setFormData({
                ...formData,
                cliente: { ...formData.cliente, cep: e.target.value },
              })
            }
          />
        </div>

        <div className="grid-row" style={{ gridTemplateColumns: "3fr 1fr" }}>
          <div className="form-group">
            <label>Logradouro (Rua/Av)</label>
            <input
              type="text"
              value={formData.cliente.rua}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cliente: { ...formData.cliente, rua: e.target.value },
                })
              }
            />
          </div>
          <div className="form-group">
            <label>Número</label>
            <input
              type="text"
              value={formData.cliente.num}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cliente: { ...formData.cliente, num: e.target.value },
                })
              }
            />
          </div>
        </div>

        <div className="form-group">
          <label>Título do Orçamento</label>
          <input
            type="text"
            placeholder="SERVIÇOS DE ELÉTRICA"
            value={formData.docTitle}
            onChange={(e) =>
              setFormData({ ...formData, docTitle: e.target.value })
            }
          />
        </div>

        <hr />
        <h3>Cláusulas e Itens</h3>

        {/* Aqui entrará o componente de Cláusulas na próxima parte */}
      </div>
    </div>
  );
};

export default CapturaOrcamento;
