import React, { useState, useEffect } from "react";
import styles from "./CapturePage.module.css";
import AppBar from "../../components/ui/AppBar/AppBar";
import PageHeader from "../../components/ui/PageHeader/PageHeader";
import ClientForm from "../../components/forms/ClientForm/ClientForm";
import ClauseManager from "../../components/forms/ClauseManager/ClauseManager";
import EASyncService from "../../services/EASyncService";
import View from "../../components/layout/View";

const CapturePage = () => {
  const [loading, setLoading] = useState(false);
  const [clientsCache, setClientsCache] = useState([]);
  const [budget, setBudget] = useState({
    id: null,
    docTitle: {
      text: "",
      emissao: new Date().toISOString().split("T")[0],
      validade: "15 dias",
    },
    cliente: { name: "", cep: "", rua: "", num: "", bairro: "", cidade: "" },
    clauses: [
      {
        id: Date.now(),
        titulo: "",
        items: [{ id: Date.now() + 1, subtitulo: "", content: "" }],
      },
    ],
  });

  // Inicialização e Carga de Dados
  useEffect(() => {
    const init = async () => {
      // Carregar Clientes do Cache
      const clients = await EASyncService.getCachedData("clients");
      setClientsCache(clients);

      // Verificar modo Edição ou Restauração
      const urlParams = new URLSearchParams(window.location.search);
      const isEdit = urlParams.get("edit") === "true";
      const isRestore = urlParams.get("restore") === "true";

      if (isEdit) {
        const editData = JSON.parse(localStorage.getItem("edit_budget_data"));
        if (editData) mapIncomingData(editData);
      } else if (isRestore) {
        const draft = JSON.parse(localStorage.getItem("ea_draft_budget"));
        const newClient = JSON.parse(
          localStorage.getItem("ea_selected_client"),
        );
        if (draft) setBudget((prev) => ({ ...prev, ...draft }));
        if (newClient) setBudget((prev) => ({ ...prev, cliente: newClient }));
      }
    };
    init();
  }, []);

  // Mapeia os dados do formato do Google Sheets para o estado do React
  const mapIncomingData = (data) => {
    // Reconstrução da lógica de Markdown original para texto editável
    const mappedClauses = data.servicos.map((s) => ({
      id: Math.random(),
      titulo: s.titulo,
      items: s.itens.map((it) => ({
        id: Math.random(),
        subtitulo: it.subtitulo,
        content: it.detalhes
          .map((d) => {
            if (d.tipo === "brk") return "---";
            if (d.tipo === "tagc") return `> ${d.conteudo}`;
            if (d.tipo === "t6") return `# ${d.conteudo}`;
            if (d.tipo === "ul")
              return d.conteudo.map((li) => `- ${li}`).join("\n");
            return d.conteudo;
          })
          .join("\n"),
      })),
    }));

    setBudget({
      id: data.id,
      docTitle: {
        text: data.docTitle.text,
        emissao:
          data.docTitle.emissao?.split("T")[0] || budget.docTitle.emissao,
        validade: data.docTitle.validade,
      },
      cliente: data.cliente,
      clauses: mappedClauses,
    });
  };

  const handleSave = async () => {
    setLoading(true);

    // Formatação da data para o padrão brasileiro DD/MM/YYYY como no original
    const [y, m, d] = budget.docTitle.emissao.split("-");
    const formattedDate = `${d}/${m}/${y}`;

    const payload = {
      id: budget.id || "TEMP_" + Date.now(),
      cliente: budget.cliente,
      docTitle: {
        subtitle: "PROPOSTA DE ORÇAMENTO",
        emissao: formattedDate,
        validade: budget.docTitle.validade,
        text: budget.docTitle.text,
      },
      servicos: budget.clauses.map((c) => ({
        titulo: c.titulo,
        itens: c.items.map((it) => ({
          subtitulo: it.subtitulo,
          detalhes: formatMarkdownForSheets(it.content),
        })),
      })),
    };

    const action = budget.id ? "update" : "create";
    const result = await EASyncService.save("orcamentos", payload, action);

    if (result.success) {
      localStorage.removeItem("ea_draft_budget");
      localStorage.removeItem("ea_selected_client");
      window.location.href = "dashboard.html";
    } else {
      alert("Erro ao salvar orçamento.");
    }
    setLoading(false);
  };

  // Lógica de parser de Markdown para o formato de objetos do Google Sheets
  const formatMarkdownForSheets = (text) => {
    const detalhes = [];
    text.split("\n").forEach((line) => {
      const tl = line.trim();
      if (!tl) return;
      if (tl === "---") detalhes.push({ tipo: "brk", conteudo: "" });
      else if (tl.startsWith(">"))
        detalhes.push({ tipo: "tagc", conteudo: tl.replace(">", "").trim() });
      else if (tl.startsWith("#"))
        detalhes.push({ tipo: "t6", conteudo: tl.replace("#", "").trim() });
      else if (tl.startsWith("*") || tl.startsWith("-")) {
        let last = detalhes[detalhes.length - 1];
        const content = tl.replace(/^[*|-]\s*/, "").trim();
        if (last && last.tipo === "ul") last.conteudo.push(content);
        else detalhes.push({ tipo: "ul", conteudo: [content] });
      } else detalhes.push({ tipo: "p", conteudo: tl });
    });
    return detalhes;
  };

  const goToCreateClient = () => {
    localStorage.setItem("ea_draft_budget", JSON.stringify(budget));
    window.location.href = "cliente.html";
  };

  return (
    <div className={styles.container}>
      {/* <AppBar title="Captura de Orçamento" /> */}

      <div className={styles.content}>
        <PageHeader center shadow="#9fabb555">
          Proposta de Orçamento
        </PageHeader>

        <div className={styles.gridRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Data de Emissão</label>
            <input
              type="date"
              className={styles.input}
              value={budget.docTitle.emissao}
              onChange={(e) =>
                setBudget({
                  ...budget,
                  docTitle: { ...budget.docTitle, emissao: e.target.value },
                })
              }
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Validade</label>
            <select
              className={styles.select}
              value={budget.docTitle.validade}
              onChange={(e) =>
                setBudget({
                  ...budget,
                  docTitle: { ...budget.docTitle, validade: e.target.value },
                })
              }
            >
              <option value="7 dias">7 dias</option>
              <option value="15 dias">15 dias</option>
              <option value="30 dias">30 dias</option>
            </select>
          </div>
        </div>

        <ClientForm
          clientData={budget.cliente}
          clientsCache={clientsCache}
          onClientChange={(data) => setBudget({ ...budget, cliente: data })}
          onNewClientClick={goToCreateClient}
        />

        <div className={styles.formGroup}>
          <label className={styles.label}>Título do Orçamento</label>
          <input
            type="text"
            className={styles.input}
            placeholder="SERVIÇOS DE ELÉTRICA (RESIDENCIAL)"
            value={budget.docTitle.text}
            onChange={(e) =>
              setBudget({
                ...budget,
                docTitle: { ...budget.docTitle, text: e.target.value },
              })
            }
          />
        </div>
      </div>

      <View tag="clauses-holder">
        <hr />
        <h3>Cláusulas e Itens</h3>

        <ClauseManager
          clauses={budget.clauses}
          onClausesChange={(newClauses) =>
            setBudget({ ...budget, clauses: newClauses })
          }
        />
      </View>

      <footer className={styles.footer}>
        <button
          className={styles.btnSave}
          onClick={handleSave}
          disabled={loading}
        >
          {loading
            ? "PROCESSANDO..."
            : budget.id
              ? "ATUALIZAR ORÇAMENTO"
              : "SALVAR ORÇAMENTO"}
        </button>
      </footer>
    </div>
  );
};

export default CapturePage;
