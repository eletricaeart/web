import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import EACard from "../../components/ui/EACard/EACard";
import AppBar from "../../components/layout/AppBar";
import FAB from "../../components/layout/FAB";
import Text from "../../components/ui/Text/Text";
import EANotionEditor from "../../components/editor/EANotionEditor/EANotionEditor";
import { processTextToHtml } from "../../utils/TextProcessor";
import EASyncService from "../../services/EASyncService";
import View from "../../components/layout/View";
import BudgetSkeleton from "./includes/BudgetSkeleton";
import { CID } from "@/utils/helpers";
import "./Budget.css";
import "./print.css";
import html2pdf from "html2pdf.js";
import { Pen, FilePdf, ShareNetwork } from "@phosphor-icons/react";

/**
 * --- [ default: Budget ]
 *  - urlParams: [
 *    nata+biru+ta = isEditing,
 *  ]
 *  */
export default function Budget() {
  const budgetRef = useRef(null);
  const [searchParams] = useSearchParams();
  const getCleanDate = (date) =>
    date.includes("T")
      ? date.split("T")[0].split("-").reverse().join("/")
      : date;

  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleEdit = () => {
    navigate(`/novo-orcamento?natabiruta=${CID()}&id=${data.id}`);
  };

  const handleSharePDF = async () => {
    const element = document.querySelector('[tag="budget-page"]');
    if (!element) return;

    // 1. Adiciona classe para forçar cores compatíveis (HEX/RGB)
    element.classList.add("pdf-export");

    const opt = {
      margin: [10, 5, 10, 5],
      filename: `Orcamento_${data.cliente.name}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        // O segredo: ignora elementos que possam quebrar o render
        ignoreElements: (el) => el.classList.contains("no-pdf"),
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    try {
      // 2. Gera o PDF
      const pdfBlob = await html2pdf().set(opt).from(element).output("blob");

      // 3. Remove a classe para o app voltar ao visual original no navegador
      element.classList.remove("pdf-export");

      const file = new File([pdfBlob], opt.filename, {
        type: "application/pdf",
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: opt.filename,
          text: `Orçamento Elétrica & Art para ${data.cliente.name}`,
        });
      } else {
        html2pdf().set(opt).from(element).save();
      }
    } catch (error) {
      element.classList.remove("pdf-export"); // Garante que a classe saia em caso de erro
      console.error("Erro ao gerar/compartilhar PDF:", error);
    }
  };

  // Configuração do FAB
  const fabActions = [
    {
      icon: <Pen size={28} weight="duotone" />,
      label: "Editar",
      action: () => {
        handleEdit();
      },
    },
    {
      icon: <ShareNetwork size={28} weight="duotone" />, // Novo botão de compartilhar
      label: "Compartilhar PDF",
      action: () => handleSharePDF(),
    },
    {
      icon: <FilePdf size={28} weight="duotone" />,
      label: "Imprimir PDF",
      action: () => window.print(),
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      // Pega o ID de forma robusta, compatível com HashRouter
      const orcamentoId = searchParams.get("id");

      if (!orcamentoId) {
        console.error("ID do orçamento não fornecido.");
        setLoading(false);
        return;
      }

      try {
        // 1 segundo garantido de rodar a animação
        const minimumTimer = new Promise((resolve) =>
          setTimeout(resolve, 2000),
        );

        // promessa de busca dos dados
        const fetchData = (async () => {
          const cached = await EASyncService.getCachedData("orcamentos");
          let budget = cached.find(
            (o) => String(o.id).trim() === String(orcamentoId).trim(),
          );

          if (!budget) {
            const response = await fetch(
              `${EASyncService.config.orcamentos.endpoint}?id=${orcamentoId}`,
            );
            budget = await response.json();
          }
          return budget;
        })();

        // Aguarda ambas: os dados E o tempo de 1 segundo
        const [budget] = await Promise.all([fetchData, minimumTimer]);

        if (budget && budget.docTitle) {
          setData(budget);
          document.title = `Orçamento_${budget.cliente.name}`;
        }
      } catch (error) {
        console.error("Erro ao carregar orçamento:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchParams]);

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

  if (loading) {
    return (
      <>
        <AppBar backAction={() => navigate(-1)} />
        <BudgetSkeleton />
      </>
    );
  }

  if (!data) {
    return (
      <>
        <AppBar backAction={() => navigate(-1)} />
        <div className="p-10 text-center">Orçamento não encontrado.</div>
      </>
    );
  }

  return (
    <>
      <AppBar backAction={() => navigate(-1)} />
      <View tag={"pageContainer"}>
        <View tag="budget-page" ref={budgetRef}>
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
                      {`${data.cliente.rua ? data.cliente.rua + ", " : ""}${
                        data.cliente.num ? data.cliente.num + " - " : ""
                      }${
                        data.cliente.bairro ? data.cliente.bairro + " - " : ""
                      }${data.cliente?.cidade}`}
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
      </View>
      <FAB actions={fabActions} hasBottomNav={false} />
    </>
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
