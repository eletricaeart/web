import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EACard from "../../components/ui/EACard/EACard";
import AppBar from "../../components/ui/AppBar/AppBar";
import FloatingActions from "../../components/ui/FloatingActions/FloatingActions";
import Text from "../../components/ui/Text/Text";
import EANotionEditor from "../../components/editor/EANotionEditor/EANotionEditor";
import { processTextToHtml } from "../../utils/TextProcessor";
import EASyncService from "../../services/EASyncService";
import View from "../../components/layout/View";
import "./Budget.css";
import "./print.css";

export default function Budget() {
  const getCleanDate = (date) =>
    date.includes("T")
      ? date.split("T")[0].split("-").reverse().join("/")
      : date;

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
        <View key={idx} tag="subclause">
          <View tag="ui">
            <View tag="subclause-header">
              <View tag="t6">{item.subtitulo}</View>
            </View>
            <View
              tag="subclause-body"
              dangerouslySetInnerHTML={{
                __html: processTextToHtml(markdownText),
              }}
            />
          </View>
        </View>
      );
    });
  };

  if (loading)
    return <div className="skeleton-overlay">Carregando visualização...</div>; // Aqui você pode inserir o JSX do seu Skeleton

  return (
    <View tag={"pageContainer"}>
      {/* <AppBar title="Visualizar Orçamento" /> */}

      <View tag="budget-page">
        {/* Cabeçalho Visual */}
        <View tag="page-header">
          <EACard />
          <View tag="doc-id">
            <span>
              <b>Data de Emissão:</b>
              <View tag="issue-date">
                {getCleanDate(data.docTitle.emissao)}
              </View>
            </span>
            <span>
              <b>Validade da Proposta:</b>{" "}
              <View tag="t">{data.docTitle.validade}</View>
            </span>
          </View>
        </View>

        {/* Título do Documento */}
        <View tag="doc-title">
          <View tag="doc-title_layout">
            <View tag={`doc-title_type`}>
              <Text
                size="1.2rem"
                color="var(--sv-sombra-azuljnk, #fff)"
                shadow="var(--sv-sodalita)"
                font='font-family: "inter", "Roboto", sans-serif'
              >
                {data.docTitle.subtitle}
              </Text>
            </View>
            <View tag="doc-title_title" className={""}>
              {data.docTitle.text}
            </View>
          </View>
        </View>

        {/* Dados do Cliente */}
        <View tag="cliente-section">
          <View tag="ui">
            <header>
              <View tag="ui">
                <View tag="t">CLIENTE</View>
              </View>
            </header>
            <View tag="content">
              <View tag="card">
                <View tag="ui">
                  <View tag="t">
                    <b>Nome:</b> {data.cliente.name}
                  </View>
                  <View tag="t">
                    <b>Endereço:</b>{" "}
                    {`${data.cliente.rua}, ${data.cliente.num} - ${data.cliente.bairro} - ${data.cliente.cidade}`}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View tag="budget-body">
          {/* Cláusulas Dinâmicas */}
          {data.servicos.map((servico, index) => (
            <View tag="clause">
              <View tag="ui">
                <View tag="clause-header">
                  <View tag="ui">
                    <View tag="t">
                      {index + 1}. {servico.titulo}
                    </View>
                  </View>
                </View>
                <View tag="clause-content">
                  {renderMarkdown(servico.itens)}
                </View>
              </View>
            </View>
          ))}

          {/* Rodapé e Assinaturas (Vindo do envtags) */}
          <FooterContent />
        </View>
      </View>

      <FloatingActions
        actions={[
          {
            icon: "✏️",
            label: "Editar",
            action: () => navigate(`/novo-orcamento?edit=true&id=${data.id}`),
          },
          {
            icon: "📋",
            label: "Imprimir PDF",
            action: () => window.print(),
          },
        ]}
      />
    </View>
  );
}

function FooterContent() {
  return (
    <>
      <View tag="footer-content">
        <View className="avoid" tag="footer-content_top">
          <View tag="content">
            <View tag="t6">{`Compromisso Elétrica&Art:`}</View>
            <p>{`Unir técnica, estética, precisão e responsabilidade para entregar um resultado impecável, durável e superior.`}</p>
            <View tag="tagb">
              <p>{`Agradecemos a oportunidade de apresentar esta proposta e estamos à disposição para quaisquer esclarecimentos adicionais.`}</p>
            </View>
          </View>
        </View>
        <View label="Assinatura e Aprovação" tag="footer-content_bottom">
          <View tag="ui">
            <header>
              <View tag="ui">
                <View tag="t">{`Assinatura e Aprovação`}</View>
              </View>
            </header>
            <View tag="content">
              <View tag="signatures" signer cliente>
                <View tag="signature" section>
                  <View tag="content">
                    <View tag="sig-name">{`Rafael - Elétrica&Art`}</View>
                  </View>
                </View>
                <View tag="signature" section>
                  <View tag="content">
                    <View tag="sig-name">{`Assinatura do Cliente`}</View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}
