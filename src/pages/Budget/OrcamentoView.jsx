import React from "react";
import { useParams } from "react-router-dom";
// import { useEASync } from "./hooks/useEASync";
import { useEASync } from "../../hooks/useEASync";
import { processNotionText } from "../../components/processNotionText";
import EACard from "../../components/layout/EACard";
import "./Budget.css";

const OrcamentoView = () => {
  const { id } = useParams();
  const { data: orcamentos } = useEASync("orcamentos");
  const orc = orcamentos.find((o) => o.id === id);

  if (!orc) return <div>Carregando orçamento...</div>;

  return (
    <div className="print-container">
      {/* O cabeçalho da Elétrica & Art */}
      <EACard />

      <section className="orc-content">
        <div className="doc-header">
          <div className="title-box">
            <h1>ORÇAMENTO</h1>
            <p>{orc.docTitle.text}</p>
          </div>
          <div className="date-box">Data: {orc.docTitle.emissao}</div>
        </div>

        <div className="client-info-bar">
          <strong>CLIENTE:</strong> {orc.cliente.name}
        </div>

        <div className="services-description">
          <h3>DESCRIÇÃO DOS SERVIÇOS</h3>
          <div
            className="notion-render"
            dangerouslySetInnerHTML={{ __html: processNotionText(orc.itens) }}
          />
        </div>

        {orc.condicoes && (
          <div className="terms-box">
            <h4>CONDIÇÕES</h4>
            <div
              dangerouslySetInnerHTML={{
                __html: processNotionText(orc.condicoes),
              }}
            />
          </div>
        )}
      </section>

      {/* Botões de Ação */}
      <div className="no-print actions-bar">
        <button onClick={() => window.print()}>🖨️ Imprimir / PDF</button>
        <button
          onClick={() => {
            const msg = `Olá ${orc.cliente.name}, segue o orçamento para ${orc.docTitle.text}.`;
            window.open(
              `https://wa.me/${orc.cliente.whatsapp}?text=${encodeURIComponent(msg)}`,
            );
          }}
        >
          💬 Enviar WhatsApp
        </button>
      </div>
    </div>
  );
};

export default OrcamentoView;
