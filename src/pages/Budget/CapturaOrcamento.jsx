import React from "react";

export default function Captura() {
  return (
    <div className="container">
      <content>
        <page-header center shadow="#f00">
          Proposta de Orçamento
        </page-header>

        <div className="grid-row">
          <div className="form-group">
            <label>Data de Emissão</label>
            <input type="date" id="doc_emissao" />
          </div>

          <div className="form-group">
            <label>Validade da Proposta</label>
            <select id="doc_validade" defaultValue="15 dias">
              <option value="7 dias">7 dias</option>
              <option value="15 dias">15 dias</option>
              <option value="30 dias">30 dias</option>
            </select>
          </div>
        </div>

        <div className="form-group client-name_inputgroup">
          <label>
            <view class="client-name_input">
              <text class="client-name_labeltext">
                Nome do Cliente / Empresa
              </text>

              <text
                class="label-help"
                style={{
                  background: "#27f",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                + NOVO CLIENTE
              </text>
            </view>
          </label>

          <input
            type="text"
            id="c_name"
            list="clients_list"
            placeholder="Digite para buscar ou criar..."
            autoFocus
          />

          <datalist id="clients_list"></datalist>
        </div>

        <div className="form-group">
          <label>
            CEP
            <span id="cep_status" className="cep-loading">
              Buscando...
            </span>
          </label>

          <input type="text" id="c_cep" placeholder="00000-000" maxLength="9" />
        </div>

        <div className="grid-row" style={{ gridTemplateColumns: "3fr 1fr" }}>
          <div className="form-group">
            <label>Logradouro (Rua/Av)</label>
            <input
              type="text"
              id="c_rua"
              placeholder="Av. President Kennedy ..."
            />
          </div>

          <div className="form-group">
            <label>Número</label>
            <input type="text" id="c_num" placeholder="Ex: 50" />
          </div>
        </div>

        <div className="form-group">
          <label>Bairro</label>
          <input type="text" id="c_bairro" placeholder="Ex: Aviação" />
        </div>

        <div className="form-group">
          <label>Cidade/UF</label>
          <input
            type="text"
            id="c_cidade"
            placeholder="Ex: Praia Grande - SP"
          />
        </div>

        <div className="form-group">
          <label>Título do Orçamento</label>
          <input
            type="text"
            id="doc_text"
            placeholder="SERVIÇOS DE ELÉTRICA (RESIDENCIAL)"
          />
        </div>

        <hr />
        <h3>Cláusulas e Itens</h3>
      </content>

      <div id="clauses_container"></div>

      <div className="btn-add_area">
        <button className="btn-add">+ Adicionar Cláusula</button>
      </div>

      <footer>
        <input
          type="button"
          id="btn_save"
          className="btn-save"
          value="SALVAR ORÇAMENTO"
        />
      </footer>
    </div>
  );
}
