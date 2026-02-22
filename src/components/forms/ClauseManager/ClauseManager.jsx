import React from "react";
import styles from "./ClauseManager.module.css";
import EANotionEditor from "../../editor/EANotionEditor/EANotionEditor";
import View from "../../layout/View";
import "./ClauseManager.css";

const ClauseManager = ({ clauses, onClausesChange }) => {
  const addClause = () => {
    const newClause = {
      id: Date.now(),
      titulo: "",
      items: [{ id: Date.now() + 1, subtitulo: "", content: "" }],
    };
    onClausesChange([...clauses, newClause]);
  };

  const removeClause = (clauseId) => {
    onClausesChange(clauses.filter((c) => c.id !== clauseId));
  };

  const updateClauseTitle = (clauseId, title) => {
    onClausesChange(
      clauses.map((c) => (c.id === clauseId ? { ...c, titulo: title } : c)),
    );
  };

  const addItem = (clauseId) => {
    onClausesChange(
      clauses.map((c) => {
        if (c.id === clauseId) {
          return {
            ...c,
            items: [...c.items, { id: Date.now(), subtitulo: "", content: "" }],
          };
        }
        return c;
      }),
    );
  };

  const removeItem = (clauseId, itemId) => {
    onClausesChange(
      clauses.map((c) => {
        if (c.id === clauseId) {
          return { ...c, items: c.items.filter((it) => it.id !== itemId) };
        }
        return c;
      }),
    );
  };

  const updateItem = (clauseId, itemId, field, value) => {
    onClausesChange(
      clauses.map((c) => {
        if (c.id === clauseId) {
          return {
            ...c,
            items: c.items.map((it) =>
              it.id === itemId ? { ...it, [field]: value } : it,
            ),
          };
        }
        return c;
      }),
    );
  };

  return (
    <View tag="clauses-field">
      {clauses.map((clause, index) => (
        <View tag="clause" key={clause.id}>
          <View tag="clause-options">
            <View tag="label-text">Título</View>
            <View
              tag="btn_remove-clause"
              onClick={() => removeClause(clause.id)}
            >
              Excluir
            </View>
          </View>
          <View tag="clause-header">
            <View tag="clause-number">{index + 1}.</View>
            <input
              type="text"
              className="clause-title_input"
              placeholder="Ex: Descrição dos Serviços"
              value={clause.titulo}
              onChange={(e) => updateClauseTitle(clause.id, e.target.value)}
            />
          </View>

          <View tag="subclause-field">
            {clause.items.map((item) => (
              <>
                <View tag="subclause" key={item.id}>
                  <View tag="subclause-overlay" />
                  <View tag="subclause-content">
                    <label>
                      <span className="label-text">Subtítulo</span>
                      <input
                        type="text"
                        className="subclause-subtitle"
                        placeholder="Ex: Cozinha"
                        value={item.subtitulo}
                        onChange={(e) =>
                          updateItem(
                            clause.id,
                            item.id,
                            "subtitulo",
                            e.target.value,
                          )
                        }
                      />
                    </label>

                    <label className="subclause-before-options">
                      <View
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="label-text">Conteúdo</span>
                        <span className="btn_help">ajuda</span>
                      </View>
                      <EANotionEditor
                        value={item.content}
                        onChange={(val) =>
                          updateItem(clause.id, item.id, "content", val)
                        }
                        placeholder="Digite - para lista..."
                      />
                    </label>
                    <View tag="subclause-options">
                      <View
                        tag="btn_remove-subclause"
                        onClick={() => removeItem(clause.id, item.id)}
                      >
                        Excluir subcláusula
                      </View>
                    </View>
                  </View>
                </View>
              </>
            ))}
          </View>

          <button
            className="btn_add-subclause"
            onClick={() => addItem(clause.id)}
          >
            + Adicionar Subcláusula
          </button>
        </View>
      ))}

      <View tag="btn_add-clause-field">
        <button className="btn_add-clause" onClick={addClause}>
          + Adicionar Cláusula
        </button>
      </View>
    </View>
  );
};

export default ClauseManager;
