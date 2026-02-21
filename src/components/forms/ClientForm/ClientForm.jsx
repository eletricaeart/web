import React, { useState, useEffect } from "react";
import "./ClientForm.css";
import View from "../../layout//View";

export default function ClientForm({
  clientData,
  onClientChange,
  clientsCache = [],
  onNewClientClick,
}) {
  const [loadingCep, setLoadingCep] = useState(false);

  // Busca automática de CEP
  const handleCepBlur = async (e) => {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length === 8) {
      setLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          onClientChange({
            ...clientData,
            cep: e.target.value,
            rua: data.logradouro,
            bairro: data.bairro,
            cidade: `${data.localidade} - ${data.uf}`,
          });
        }
      } catch (err) {
        console.error("Erro ao buscar CEP:", err);
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    // Mapeia o ID do input para a chave do objeto cliente
    const fieldMap = {
      c_name: "name",
      c_cep: "cep",
      c_rua: "rua",
      c_num: "num",
      c_bairro: "bairro",
      c_cidade: "cidade",
    };
    onClientChange({ ...clientData, [fieldMap[id]]: value });
  };

  // Preenchimento automático ao selecionar da lista
  const handleNameChange = (e) => {
    const selected = clientsCache.find((c) => c.name === e.target.value);
    if (selected) {
      onClientChange({
        name: selected.name,
        cep: selected.cep || "",
        rua: selected.rua || "",
        num: selected.num || "",
        bairro: selected.bairro || "",
        cidade: selected.cidade || "",
      });
    } else {
      handleChange(e);
    }
  };

  return (
    <View tag="cliente-section">
      {/* Nome do Cliente */}
      <View tag="client-name_inputgroup">
        <View tag="client-name_input">
          <View tag="t">Nome do Cliente / Empresa</View>
          <View type="button" tag="btn-novo-cliente" onClick={onNewClientClick}>
            + NOVO CLIENTE
          </View>
        </View>
        <input
          type="text"
          id="c_name"
          className={"styles.input"}
          list="clients_list"
          placeholder="Digite para buscar ou criar..."
          value={clientData.name}
          onChange={handleNameChange}
          autoFocus
        />
        <datalist id="clients_list">
          {clientsCache.map((c, i) => (
            <option key={i} value={c.name} />
          ))}
        </datalist>
      </View>

      {/* CEP */}
      <View className={"styles.formGroup"}>
        <View className={"styles.label"}>
          <span>
            CEP{" "}
            {loadingCep && (
              <span className={"styles.cepLoading"}>Buscando...</span>
            )}
          </span>
        </View>
        <input
          type="text"
          id="c_cep"
          className={"styles.input"}
          placeholder="00000-000"
          maxLength="9"
          value={clientData.cep}
          onChange={handleChange}
          onBlur={handleCepBlur}
        />
      </View>

      {/* Endereço */}
      <View
        className={"styles.gridRow"}
        style={{ gridTemplateColumns: "3fr 1fr" }}
      >
        <View className={"styles.formGroup"}>
          <label className={"styles.label"}>Logradouro (Rua/Av)</label>
          <input
            type="text"
            id="c_rua"
            className={"styles.input"}
            placeholder="Av. President Kennedy ..."
            value={clientData.rua}
            onChange={handleChange}
          />
        </View>
        <View className={"styles.formGroup"}>
          <label className={"styles.label"}>Número</label>
          <input
            type="text"
            id="c_num"
            className={"styles.input"}
            placeholder="Ex: 50"
            value={clientData.num}
            onChange={handleChange}
          />
        </View>
      </View>

      <View className={"styles.gridRow"}>
        <View className={"styles.formGroup"}>
          <label className={"styles.label"}>Bairro</label>
          <input
            type="text"
            id="c_bairro"
            className={"styles.input"}
            placeholder="Ex: Aviação"
            value={clientData.bairro}
            onChange={handleChange}
          />
        </View>
        <View className={"styles.formGroup"}>
          <label className={"styles.label"}>Cidade/UF</label>
          <input
            type="text"
            id="c_cidade"
            className={"styles.input"}
            placeholder="Ex: Praia Grande - SP"
            value={clientData.cidade}
            onChange={handleChange}
          />
        </View>
      </View>
    </View>
  );
}
