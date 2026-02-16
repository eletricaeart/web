import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./OrcamentoPage.module.css";
import EACard from "../../components/ui/EACard/EACard";
import AppBar from "../../components/ui/AppBar/AppBar";
import FloatingActions from "../../components/ui/FloatingActions/FloatingActions";
import Text from "../../components/ui/Text/Text";
import EANotionEditor from "../../components/editor/EANotionEditor/EANotionEditor";
import { processTextToHtml } from "../../utils/TextProcessor";
import EASyncService from "../../services/EASyncService";
import { envtags } from "../../config/env";

const OrcamentoPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const orcamentoId = urlParams.get("id");

      try {
        const cached = await EASyncService.getCachedData("orcamentos");
        let budget = cached.find(
          (o) => String(o.id).trim() === String(orcamentoId).trim(),
        );

        if (!budget) {
          // Se não houver cache, busca direto do servidor
          const response = await fetch(
            `${EASyncService.config.orcamentos.endpoint}?id=${orcamentoId}`,
          );
          budget = await response.json();
        }

        if (budget) {
          setData(budget);
          document.title = `Orçamento_${budget.cliente.name}`;
        }
      } catch (error) {
        console.error("Erro ao carregar orçamento:", error);
      } finally {
        setTimeout(() => setLoading(false), 500); // Suaviza a transição do skeleton
      }
    };

    loadData();
  }, []);

  const renderMarkdown = (itens) => {
    return itens.map((item, idx) => {
      const markdownText = item.detalhes
        .map((d) => {
          if (d.tipo === "brk") return "---";
          if (d.tipo === "tagc") return `> ${d.conteudo}`;
          if (d.tipo === "t6") return `# ${d.conteudo}`;
          if (d.tipo === "ul")
            return d.conteudo.map((li) => `- ${li}`).join("\n");
          return d.conteudo;
        })
        .join("\n");

      return (
        <section key={idx} className={styles.subclause}>
          <div className={styles.subclauseHeader}>{item.subtitulo}</div>
          <div
            className="subclause-body"
            dangerouslySetInnerHTML={{
              __html: processTextToHtml(markdownText),
            }}
          />
        </section>
      );
    });
  };

  if (loading)
    return <div className="skeleton-overlay">Carregando visualização...</div>; // Aqui você pode inserir o JSX do seu Skeleton

  return (
    <div className={styles.pageContainer}>
      <AppBar title="Visualizar Orçamento" />

      <div className={`${styles.invoiceHtml} ${!loading ? styles.loaded : ""}`}>
        {/* Cabeçalho Visual */}
        <header className={styles.pageHeader}>
          <EACard />
          <div className={styles.docId}>
            <span>
              <b>Data de Emissão:</b> {data.docTitle.emissao}
            </span>
            <span>
              <b>Validade da Proposta:</b> {data.docTitle.validade}
            </span>
          </div>
        </header>

        {/* Título do Documento */}
        <div className={styles.docTitleSection}>
          <div className={styles.docTitleType}>
            <Text
              size="1.2rem"
              color="var(--sv-sombra-azul)"
              shadow="var(--sv-sodalita)"
            >
              {data.docTitle.subtitle}
            </Text>
          </div>
          <div className={styles.docTitleMain}>{data.docTitle.text}</div>
        </div>

        {/* Dados do Cliente */}
        <div
          className="cliente-info-box"
          style={{
            border: "1px solid #eee",
            padding: "15px",
            borderRadius: "12px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              color: "var(--sv-sombra-azul)",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            CLIENTE
          </div>
          <div>
            <b>Nome:</b> {data.cliente.name}
          </div>
          <div>
            <b>Endereço:</b>{" "}
            {`${data.cliente.rua}, ${data.cliente.num} - ${data.cliente.bairro} - ${data.cliente.cidade}`}
          </div>
        </div>

        {/* Cláusulas Dinâmicas */}
        {data.servicos.map((servico, index) => (
          <article key={index} className={styles.clause}>
            <header className={styles.clauseHeader}>
              <div style={{ fontWeight: "bold", textTransform: "uppercase" }}>
                {index + 1}. {servico.titulo}
              </div>
            </header>
            <div className={styles.clauseContent}>
              {renderMarkdown(servico.itens)}
            </div>
          </article>
        ))}

        {/* Rodapé e Assinaturas (Vindo do envtags) */}
        <div dangerouslySetInnerHTML={{ __html: envtags.endingTag }} />
      </div>

      <FloatingActions
        actions={[
          {
            icon: "✏️",
            label: "Editar",
            action: () => navigate(`/captura?edit=true&id=${data.id}`),
          },
          {
            icon: "📋",
            label: "Imprimir PDF",
            action: () => window.print(),
          },
        ]}
      />
    </div>
  );
};

export default OrcamentoPage;
