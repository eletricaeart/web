import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEASync } from "../../hooks/useEASync";
import AppBar from "../../components/layout/AppBar";
import "./Clientes.css";

/**
 * --- [ default: ClienteCaptura ]
 *  */
export default function ClienteCaptura() {
  const navigate = useNavigate();
  const { save: saveClient } = useEASync("clients");

  const [formData, setFormData] = useState({
    id: null,
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Nome obrigatório!");
      return;
    }

    const payload = {
      ...formData,
      id: `TEMP_${Date.now()}`,
    };

    const res = await saveClient(payload, "create");

    if (!res.success) {
      alert("Erro ao salvar cliente: " + res.error);
      return;
    }

    // 🔁 Se veio de orçamento, volta
    const draft = localStorage.getItem("ea_draft_budget");

    if (draft) {
      localStorage.setItem("ea_selected_client", JSON.stringify(payload));
      navigate("/captura?restore=true");
    } else {
      navigate("/clientes");
    }
  };

  return (
    <>
      <AppBar title="Novo Cliente" backAction={() => navigate(-1)} />

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
        <div className="card-ea">
          <div className="card-ea-header">DADOS BÁSICOS</div>
          <div className="card-ea-body">
            <label>Nome *</label>
            <input name="name" onChange={handleChange} />

            <label>Gênero</label>
            <select name="gender" onChange={handleChange}>
              <option value="masc">Masculino</option>
              <option value="fem">Feminino</option>
            </select>

            <label>CPF/CNPJ</label>
            <input name="doc" onChange={handleChange} />
          </div>
        </div>

        <div className="card-ea">
          <div className="card-ea-header">CONTATO</div>
          <div className="card-ea-body">
            <label>WhatsApp</label>
            <input name="whatsapp" onChange={handleChange} />

            <label>Email</label>
            <input name="email" onChange={handleChange} />
          </div>
        </div>

        <div className="card-ea">
          <div className="card-ea-header">ENDEREÇO</div>
          <div className="card-ea-body">
            <label>CEP</label>
            <input name="cep" onChange={handleChange} />

            <label>Rua</label>
            <input name="rua" onChange={handleChange} />

            <label>Número</label>
            <input name="num" onChange={handleChange} />

            <label>Bairro</label>
            <input name="bairro" onChange={handleChange} />

            <label>Cidade</label>
            <input name="cidade" onChange={handleChange} />
          </div>
        </div>

        <footer className="footer-btn">
          <button className="btn-save" onClick={handleSave}>
            SALVAR CLIENTE
          </button>
        </footer>
      </div>
    </>
  );
}
