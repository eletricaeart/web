import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEASync } from "../../hooks/useEASync";
import AppBar from "../../components/layout/AppBar";
import View from "@/components/layout/View";
import "./Clientes.css";

/**
 * --- [ default: ClienteEditar ]
 *  */
export default function ClienteEditar() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");

  const { data: clients, save: saveClient } = useEASync("clients");

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const client = clients.find((c) => String(c.id) === String(id));
    if (client) {
      setFormData(client);
    }
  }, [clients, id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const res = await saveClient(formData, "update");

    if (!res.success) {
      alert("Erro ao atualizar: " + res.error);
      return;
    }

    navigate(`/cliente?id=${id}`);
  };

  if (!formData) return <p>Carregando...</p>;

  return (
    <>
      <AppBar title="Editar Cliente" backAction={() => navigate(-1)} />

      <View className="avatar-section">
        <View className="avatar-circle">
          <img
            src={`/pix/avatar/default_avatar_${formData.gender}.webp`}
            alt="Avatar"
          />
        </View>
        <h2>{formData.name}</h2>
      </View>

      <View className="form-container" style={{ padding: "0 1rem 120px" }}>
        <View className="card-ea">
          <View className="card-ea-header">DADOS BÁSICOS</View>
          <View className="card-ea-body">
            <label>Nome</label>
            <input name="name" value={formData.name} onChange={handleChange} />

            <label>Gênero</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="masc">Masculino</option>
              <option value="fem">Feminino</option>
            </select>

            <label>CPF/CNPJ</label>
            <input
              name="doc"
              value={formData.doc || ""}
              onChange={handleChange}
            />
          </View>
        </View>

        <View className="card-ea">
          <View className="card-ea-header">CONTATO</View>
          <View className="card-ea-body">
            <label>WhatsApp</label>
            <input
              name="whatsapp"
              value={formData.whatsapp || ""}
              onChange={handleChange}
            />

            <label>Email</label>
            <input
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
            />
          </View>
        </View>

        <View className="card-ea">
          <View className="card-ea-header">ENDEREÇO</View>
          <View className="card-ea-body">
            <label>CEP</label>
            <input
              name="cep"
              value={formData.cep || ""}
              onChange={handleChange}
            />

            <label>Rua</label>
            <input
              name="rua"
              value={formData.rua || ""}
              onChange={handleChange}
            />

            <label>Número</label>
            <input
              name="num"
              value={formData.num || ""}
              onChange={handleChange}
            />

            <label>Bairro</label>
            <input
              name="bairro"
              value={formData.bairro || ""}
              onChange={handleChange}
            />

            <label>Cidade</label>
            <input
              name="cidade"
              value={formData.cidade || ""}
              onChange={handleChange}
            />
          </View>
        </View>
      </View>
      <footer className="footer-btn">
        <button className="btn-save" onClick={handleSave}>
          SALVAR ALTERAÇÕES
        </button>
      </footer>
    </>
  );
}
