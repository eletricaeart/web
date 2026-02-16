import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEASync } from "../../hooks/useEASync";
import EANotionEditor from "../../components/EANotionEditor";
import AppBar from "../../components/layout/AppBar";

const CapturaOrcamento = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { save: saveOrcamento, data: orcamentos } = useEASync("orcamentos");

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    cliente: { name: "", whatsapp: "", endereco: "" },
    docTitle: { text: "", emissao: new Date().toLocaleDateString("pt-BR") },
    itens: "",
    condicoes:
      "Pagamento: 50% de entrada e 50% na entrega.\nValidade: 10 dias.",
  });

  // Lógica de Restauração/Edição
  useEffect(() => {
    const editId = searchParams.get("edit");
    if (editId) {
      const existing = orcamentos.find((o) => o.id === editId);
      if (existing) setFormData(existing);
    } else if (searchParams.get("restore")) {
      const draft = localStorage.getItem("ea_draft_budget");
      if (draft) setFormData(JSON.parse(draft));
    }
  }, [searchParams, orcamentos]);

  const handleSave = async () => {
    const payload = {
      ...formData,
      id: searchParams.get("edit") || `TEMP_${Date.now()}`,
    };

    const res = await saveOrcamento(
      payload,
      searchParams.get("edit") ? "update" : "create",
    );
    if (res.success) {
      localStorage.removeItem("ea_draft_budget");
      navigate("/dashboard");
    }
  };

  return (
    <div className="captura-page">
      <AppBar customTitle="Novo Orçamento" />

      <div className="container" style={{ padding: "20px" }}>
        {/* Seção Cliente */}
        <div className="card-ea">
          <div className="card-ea-header">CLIENTE E SERVIÇO</div>
          <div className="card-ea-body">
            <input
              placeholder="Nome do Cliente"
              value={formData.cliente.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cliente: { ...formData.cliente, name: e.target.value },
                })
              }
            />
            <input
              placeholder="O que será feito? (Ex: Reforma Elétrica)"
              value={formData.docTitle.text}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  docTitle: { ...formData.docTitle, text: e.target.value },
                })
              }
            />
          </div>
        </div>

        {/* Seção Itens com EANotionEditor */}
        <div className="card-ea">
          <div className="card-ea-header">DESCRIÇÃO DOS SERVIÇOS</div>
          <div className="card-ea-body">
            <EANotionEditor
              value={formData.itens}
              onChange={(val) => setFormData({ ...formData, itens: val })}
              placeholder="Use * para listas e > para destaques..."
            />
          </div>
        </div>

        <button className="btn-save-full" onClick={handleSave}>
          FINALIZAR E GERAR PDF
        </button>
      </div>
    </div>
  );
};

export default CapturaOrcamento;
