import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEASync } from "../../hooks/useEASync";
import AppBar from "../../components/layout/AppBar";
import View from "@/components/layout/View";
import { CircleNotch, MapPinLine } from "@phosphor-icons/react";
import "./Clientes.css";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ClienteCaptura() {
  const navigate = useNavigate();
  const { save: saveClient } = useEASync("clients");
  const [loading, setLoading] = useState(false);
  const [fetchingCep, setFetchingCep] = useState(false); // Estado para busca de CEP

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

  // Lógica de busca de CEP
  useEffect(() => {
    const buscarCep = async () => {
      const cepLimpo = formData.cep.replace(/\D/g, "");

      if (cepLimpo.length === 8) {
        setFetchingCep(true);
        try {
          const response = await fetch(
            `https://viacep.com.br/ws/${cepLimpo}/json/`,
          );
          const data = await response.json();

          if (!data.erro) {
            setFormData((prev) => ({
              ...prev,
              rua: data.logradouro || prev.rua,
              bairro: data.bairro || prev.bairro,
              cidade: `${data.localidade} - ${data.uf}`,
            }));
          }
        } catch (error) {
          console.error("Erro ao buscar CEP:", error);
        } finally {
          setFetchingCep(false);
        }
      }
    };

    buscarCep();
  }, [formData.cep]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (value) => {
    setFormData({ ...formData, gender: value });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Nome obrigatório!");
      return;
    }

    setLoading(true);

    const payload = {
      ...formData,
      id: `TEMP_${Date.now()}`,
    };

    const res = await saveClient(payload, "create");

    if (!res.success) {
      alert("Erro ao salvar cliente: " + res.error);
      setLoading(false);
      return;
    }

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
      <View
        tag="add-client-page"
        style={{ display: "flex", flexFlow: "column" }}
      >
        <View tag="avatar" className="avatar-section">
          <View className="avatar-circle">
            <img
              src={`/pix/avatar/default_avatar_${formData.gender}.webp`}
              alt="Avatar"
            />
          </View>
          <h2>{formData.name || "Novo Cliente"}</h2>
        </View>

        <View tag="add-client-form" style={{ padding: "0 1rem" }}>
          <View tag="card-ea-client">
            <View tag="card-ea-header">DADOS BÁSICOS</View>
            <View tag="card-ea-body">
              <label>
                Nome *
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </label>

              <label
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                Gênero
                <Select
                  onValueChange={handleGenderChange}
                  defaultValue={formData.gender}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full bg-white border border-none p-4">
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>
                  <SelectContent
                    className="border-neutral-300"
                    style={{ borderWidth: "2px", padding: "1rem" }}
                  >
                    <SelectItem value="masc" style={{ padding: "1rem .5rem" }}>
                      Masculino
                    </SelectItem>
                    <SelectItem value="fem" style={{ padding: "1rem .5rem" }}>
                      Feminino
                    </SelectItem>
                  </SelectContent>
                </Select>
              </label>

              <label>
                CPF/CNPJ
                <input
                  name="doc"
                  value={formData.doc}
                  onChange={handleChange}
                  disabled={loading}
                />
              </label>
            </View>
          </View>

          <View tag="card-ea-client">
            <View tag="card-ea-header">CONTATO</View>
            <View tag="card-ea-body">
              <label>
                WhatsApp{" "}
                <input
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  disabled={loading}
                />
              </label>
              <label>
                Email{" "}
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </label>
            </View>
          </View>

          <View tag="card-ea-client">
            <View tag="card-ea-header">ENDEREÇO</View>
            <View tag="card-ea-body">
              <label style={{ position: "relative" }}>
                CEP
                <input
                  name="cep"
                  value={formData.cep}
                  onChange={handleChange}
                  placeholder="00000-000"
                  disabled={loading || fetchingCep}
                />
                {fetchingCep && (
                  <CircleNotch
                    size={18}
                    className="animate-spin"
                    style={{
                      position: "absolute",
                      right: "10px",
                      bottom: "12px",
                      color: "var(--sv-sodalita)",
                    }}
                  />
                )}
              </label>

              <View
                style={{ display: "flex", flexDirection: "row", gap: "1rem" }}
              >
                <label style={{ flex: ".7" }}>
                  Rua
                  <input
                    name="rua"
                    value={formData.rua}
                    onChange={handleChange}
                    disabled={loading || fetchingCep}
                  />
                </label>
                <label style={{ flex: ".3" }}>
                  Número
                  <input
                    name="num"
                    value={formData.num}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </label>
              </View>

              <label>
                Bairro
                <input
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  disabled={loading || fetchingCep}
                />
              </label>

              <label>
                Cidade
                <input
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  disabled={loading || fetchingCep}
                />
              </label>
            </View>
          </View>
        </View>
      </View>

      <footer
        className="footer-btn"
        style={{ display: "flex", padding: "2rem" }}
      >
        <button
          className="btn-save"
          onClick={handleSave}
          disabled={loading || fetchingCep}
          style={{
            background: loading ? "#94a3b8" : "var(--sv-sodalita)",
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            transition: "all 0.3s ease",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? (
            <>
              <CircleNotch size={20} weight="bold" className="animate-spin" />
              SALVANDO...
            </>
          ) : (
            "SALVAR CLIENTE"
          )}
        </button>
      </footer>
    </>
  );
}
