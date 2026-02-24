import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AppBar from "../../components/layout/AppBar";
import PageHeader from "../../components/ui/PageHeader/PageHeader";
import ClientForm from "../../components/forms/ClientForm/ClientForm";
import ClauseManager from "../../components/forms/ClauseManager/ClauseManager";
import EASyncService from "../../services/EASyncService";
import View from "../../components/layout/View";
import "./NewBudget.css";
import Divider from "@/components/ui/divider";
import { CircleNotch } from "@phosphor-icons/react";

/**
 * --- [ default: NewBudget ]
 * */
export default function NewBudget() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get("id");
  const isEditing = searchParams.get("natabiruta");

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
      // 1. Carregar Clientes para o Select
      const clients = await EASyncService.getCachedData("clients");
      setClientsCache(clients);

      // 2. Se houver ID na URL, carregar dados do orçamento
      if (editId) {
        setLoading(true);
        try {
          const cached = await EASyncService.getCachedData("orcamentos");
          let budgetToEdit = cached.find(
            (o) => String(o.id) === String(editId),
          );

          if (!budgetToEdit) {
            // Busca no servidor se não estiver no cache
            const response = await fetch(
              `${EASyncService.config.orcamentos.endpoint}?id=${editId}`,
            );
            budgetToEdit = await response.json();
          }

          if (budgetToEdit) {
            mapIncomingData(budgetToEdit); // Usa sua função de mapeamento já existente
          }
        } catch (error) {
          console.error("Erro ao carregar orçamento para edição:", error);
        } finally {
          setLoading(false);
        }
      }
      // 3. Caso contrário, verifica se é uma restauração de rascunho (fluxo de novo cliente)
      else if (searchParams.get("restore") === "true") {
        const draft = JSON.parse(localStorage.getItem("ea_draft_budget"));
        const newClient = JSON.parse(
          localStorage.getItem("ea_selected_client"),
        );
        if (draft) setBudget((prev) => ({ ...prev, ...draft }));
        if (newClient) setBudget((prev) => ({ ...prev, cliente: newClient }));
      }
    };
    init();
  }, [editId, searchParams]);

  const mapIncomingData = (data) => {
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
        // Correção: Usa a função de normalização aqui
        emissao: formatDateForInput(data.docTitle.emissao),
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
      // id: budget.id || "TEMP_" + Date.now(),
      id: editId || budget.id || "TEMP_" + Date.now(),
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
      navigate("/budgets");
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
    navigate("/cliente");
  };

  return (
    <>
      <AppBar
        title={isEditing ? `Edição` : `Novo Orçamento`}
        backAction={() => {
          if (localStorage.getItem("edit_budget_data")) {
            localStorage.removeItem("edit_budget_data");
            console.log("🧹 Cache de edição de orçamento removido.");
          }
          navigate(-1);
        }}
      />
      <View tag={"page"}>
        <PageHeader center shadow="#9fabb555">
          Proposta de Orçamento
        </PageHeader>
        <View tag="page-content">
          <h3 className="page-subtitle">Dados do orçamento</h3>

          <View className={"formGroup"}>
            <label
              className={"label"}
              style={{ margin: "0", padding: "5px 0" }}
            >
              <View tag="t">Título</View>
              <input
                type="text"
                className={"input"}
                placeholder="SERVIÇOS DE ELÉTRICA (RESIDENCIAL)"
                value={budget.docTitle.text}
                onChange={(e) =>
                  setBudget({
                    ...budget,
                    docTitle: { ...budget.docTitle, text: e.target.value },
                  })
                }
              />
            </label>
          </View>

          <View tag="budget-infos" className="pd">
            <View tag={"grid-duo"}>
              <label className="flex-5">
                <View tag="t">Data de Emissão</View>
                <input
                  type="date"
                  className={"input"}
                  value={budget.docTitle.emissao}
                  onChange={(e) =>
                    setBudget({
                      ...budget,
                      docTitle: { ...budget.docTitle, emissao: e.target.value },
                    })
                  }
                />
              </label>
              <label className={"flex-5"}>
                <View tag="t">Validade</View>
                <select
                  className={"select"}
                  value={budget.docTitle.validade}
                  onChange={(e) =>
                    setBudget({
                      ...budget,
                      docTitle: {
                        ...budget.docTitle,
                        validade: e.target.value,
                      },
                    })
                  }
                >
                  <option value="7 dias">7 dias</option>
                  <option value="15 dias">15 dias</option>
                  <option value="30 dias">30 dias</option>
                  <option value="60 dias">60 dias</option>
                  <option value="90 dias">90 dias</option>
                </select>
              </label>
            </View>
          </View>

          <Divider padding="2rem" height={"2px"} color="transparent" />
          <h3 className="page-subtitle">Dados do cliente</h3>
          <ClientForm
            clientData={budget.cliente}
            clientsCache={clientsCache}
            onClientChange={(data) => setBudget({ ...budget, cliente: data })}
            onNewClientClick={goToCreateClient}
          />
        </View>

        <Divider padding="2rem" height={"2px"} color="transparent" />

        <View tag="clauses-holder">
          <header className="subtitle-header">
            <h3 className="page-subtitle">Cláusulas e Itens</h3>
          </header>

          <ClauseManager
            clauses={budget.clauses}
            onClausesChange={(newClauses) =>
              setBudget({ ...budget, clauses: newClauses })
            }
          />
        </View>

        <footer className={"footer"}>
          <button
            className={"btnSave"}
            onClick={handleSave}
            disabled={loading}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
            }}
          >
            {loading ? (
              <>
                {/* Ícone animado com Tailwind */}
                <CircleNotch size={20} weight="bold" className="animate-spin" />
                <span>PROCESSANDO...</span>
              </>
            ) : (
              <span>
                {budget.id ? "ATUALIZAR ORÇAMENTO" : "SALVAR ORÇAMENTO"}
              </span>
            )}
          </button>
        </footer>
      </View>
    </>
  );
}

const formatDateForInput = (dateStr) => {
  if (!dateStr) return new Date().toISOString().split("T")[0];

  // Se vier no formato ISO (2026-02-16T...) ou já no formato YYYY-MM-DD
  if (dateStr.includes("-")) {
    return dateStr.split("T")[0];
  }

  // Se vier no formato brasileiro (DD/MM/YYYY) salvo no GS
  if (dateStr.includes("/")) {
    const [d, m, y] = dateStr.split("/");
    return `${y}-${m}-${d}`;
  }

  return new Date().toISOString().split("T")[0];
};
