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
import { useReactToPrint } from "react-to-print";
import { domToBlob, domToCanvas } from "modern-screenshot";
import { jsPDF } from "jspdf";
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

  const handleShareAsImg = async () => {
    const element = budgetRef.current;
    if (!element) return;

    try {
      // 1. Converte o DOM para Blob (suporta as cores do Tailwind v4)
      const blob = await domToBlob(element, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      // 2. Criamos um arquivo de Imagem (PNG) ou PDF
      // Nota: Compartilhar como PNG é mais rápido e garante 100% de fidelidade no WhatsApp
      const file = new File([blob], `Orcamento_${data.cliente.name}.png`, {
        type: "image/png",
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Orçamento Elétrica & Art",
          text: `Olá ${data.cliente.name}, segue o orçamento conforme conversamos.`,
        });
      } else {
        // Se não puder compartilhar, faz o download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Orcamento_${data.cliente.name}.png`;
        link.click();
      }
    } catch (error) {
      console.error("Erro ao gerar imagem para compartilhamento:", error);
      alert("Erro ao processar documento. Tente usar a opção de Imprimir PDF.");
    }
  };

  const handleShareIMGPDF = async () => {
    const element = budgetRef.current;
    if (!element) return;

    try {
      console.log("Gerando PDF multipágina...");

      const canvas = await domToCanvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);

      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Primeira página
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Páginas adicionais
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const fileName = `Orcamento_${data.cliente.name.replace(/\s+/g, "_")}.pdf`;

      const pdfBlob = pdf.output("blob");
      const file = new File([pdfBlob], fileName, {
        type: "application/pdf",
      });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: fileName,
          text: `Olá ${data.cliente.name}, segue o orçamento em PDF.`,
        });
      } else {
        pdf.save(fileName);
      }
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar PDF.");
    }
  };

  const handleSharePDF = useReactToPrint({
    contentRef: budgetRef,
    // documentTitle: `Orcamento_${data.cliente.name}`,
    documentTitle: `Orcamento_${"data.cliente.name"}`,
    preserveAfterPrint: true,

    print: async (iframe) => {
      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;

      if (!iframeDoc) return;

      // ⏳ Aguarda o CSS de print ser aplicado
      await new Promise((r) => setTimeout(r, 1000));

      // Clona o conteúdo já tratado pelo @media print
      const printable = iframeDoc.querySelector("body");

      const canvas = await domToCanvas(printable, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);

      const imgWidth = pageWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `Orcamento_${data.cliente.name.replace(/\s+/g, "_")}.pdf`;

      const blob = pdf.output("blob");
      const file = new File([blob], fileName, {
        type: "application/pdf",
      });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: fileName,
          text: `Olá ${data.cliente.name}, segue o orçamento em PDF.`,
        });
      } else {
        pdf.save(fileName);
      }
    },
  });

  const handleShareHTML2PDF = useReactToPrint({
    contentRef: budgetRef,
    documentTitle: `Orcamento_${data?.cliente?.name}`,
    preserveAfterPrint: true,

    print: async (iframe) => {
      const printDoc = iframe.contentDocument || iframe.contentWindow.document;

      const printRoot = printDoc.querySelector("[tag='budget-page']");

      if (!printRoot) {
        alert("Erro ao localizar conteúdo para impressão.");
        return;
      }

      await new Promise((r) => setTimeout(r, 500));

      const opt = {
        margin: 0,
        filename: `Orcamento_${data.cliente.name.replace(/\s+/g, "_")}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: 2,
          useCORS: true,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
        pagebreak: {
          mode: ["css", "legacy"],
        },
      };

      const worker = html2pdf().set(opt).from(printRoot);

      const pdfBlob = await worker.outputPdf("blob");

      const file = new File([pdfBlob], `Orcamento_${data.cliente.name}.pdf`, {
        type: "application/pdf",
      });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Orçamento",
          text: `Olá ${data.cliente.name}, segue o orçamento conforme conversamos.`,
        });
      } else {
        worker.save();
      }
    },
  });

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
      icon: <ShareNetwork size={28} weight="duotone" />,
      label: "Enviar Imagem",
      action: () => handleShareAsImg(),
    },
    {
      icon: <ShareNetwork size={28} weight="duotone" />, // Novo botão de compartilhar
      label: "HTML 2 PDF",
      action: () => handleShareHTML2PDF(),
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
