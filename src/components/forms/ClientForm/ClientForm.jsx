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
    <View tag="cliente-fieldset">
      {/* Nome do Cliente */}
      <View tag="client-name_input">
        <View tag="btn_add-cliente" onClick={onNewClientClick}>
          + selecionar CLIENTE
        </View>
        <label>
          <View tag="t">Nome do Cliente / Empresa</View>
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
        </label>
        <datalist id="clients_list">
          {clientsCache.map((c, i) => (
            <option key={i} value={c.name} />
          ))}
        </datalist>
      </View>

      {/* CEP */}
      <View tag="cep-input">
        <label>
          <span>
            CEP{" "}
            {loadingCep && (
              <span className={"styles.cepLoading"}>Buscando...</span>
            )}
          </span>
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
        </label>
      </View>

      {/* Endereço */}
      <View
        tag="logradouro_numero-inputs"
        style={{ gridTemplateColumns: "3fr 1fr" }}
      >
        <View tag="logradouro-input">
          <label className={"styles.label"}>
            <View tag="t">Logradouro (Rua/Av)</View>
            <input
              type="text"
              id="c_rua"
              placeholder="Av. President Kennedy ..."
              value={clientData.rua}
              onChange={handleChange}
            />
          </label>
        </View>
        <View tag="numero-input">
          <label className={"styles.label"}>
            <View tag="t">Número</View>
            <input
              type="text"
              id="c_num"
              className={"styles.input"}
              placeholder="Ex: 50"
              value={clientData.num}
              onChange={handleChange}
            />
          </label>
        </View>
      </View>

      <View tag="bairro-input">
        <label className={"styles.label"}>
          <View tag="t">Bairro</View>
          <input
            type="text"
            id="c_bairro"
            className={"styles.input"}
            placeholder="Ex: Aviação"
            value={clientData.bairro}
            onChange={handleChange}
          />
        </label>
      </View>
      <View tag="cidade-input">
        <label className={"styles.label"}>
          <View tag="t">Cidade/UF</View>
          <input
            type="text"
            id="c_cidade"
            className={"styles.input"}
            placeholder="Ex: Praia Grande - SP"
            value={clientData.cidade}
            onChange={handleChange}
          />
        </label>
      </View>
    </View>
  );
}
