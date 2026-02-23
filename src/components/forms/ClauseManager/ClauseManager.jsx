import React from "react";
import styles from "./ClauseManager.module.css";
import EANotionEditor from "../../editor/EANotionEditor/EANotionEditor";
import View from "../../layout/View";
// import "./ClauseManager.css";

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
          <View tag="clause-options" className={styles.clauseOptions}>
            <View tag="label-text" className={styles.labelTitle}>
              Título
            </View>
            <View
              tag="btn_remove-clause"
              className={styles.btn_remove_clause}
              onClick={() => removeClause(clause.id)}
            >
              Excluir
            </View>
          </View>
          <View tag="clause-header" className={styles.clauseHeader}>
            <View className={styles.clauseHeader_ui}>
              <View tag="clause-number" className={styles.clauseNumber}>
                {index + 1}.
              </View>
              <input
                type="text"
                className={styles.clauseTitleInput}
                placeholder="Ex: Descrição dos Serviços"
                value={clause.titulo}
                onChange={(e) => updateClauseTitle(clause.id, e.target.value)}
              />
            </View>
          </View>

          <View tag="subclause-field">
            {clause.items.map((item) => (
              <>
                <View
                  tag="subclause"
                  key={item.id}
                  className={styles.subclause}
                >
                  <View
                    tag="subclause-content"
                    className={styles.subclauseContent}
                  >
                    <label className={styles.subclauseTitle}>
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

                    <label
                      className="subclause-before-options"
                      className={styles.subclauseHelpTips}
                    >
                      <View
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="label-text">Conteúdo</span>
                        <span className={styles.btn_helpTips}>ajuda</span>
                      </View>
                      <EANotionEditor
                        bg="#f5f5f5"
                        radius="9px"
                        value={item.content}
                        onChange={(val) =>
                          updateItem(clause.id, item.id, "content", val)
                        }
                        placeholder="Digite - para lista..."
                      />
                    </label>
                  </View>
                </View>
                <View
                  tag="subclause-options"
                  className={styles.subclauseOptions}
                >
                  <View
                    tag="subclause-options-overlay"
                    className={styles.subclauseOptionsOverlay}
                  />
                  <View
                    tag="btn_remove-subclause"
                    className={styles.btn_remove_subclause}
                    onClick={() => removeItem(clause.id, item.id)}
                  >
                    Excluir subcláusula
                  </View>
                </View>
              </>
            ))}
          </View>

          <button
            className="btn_add-subclause"
            onClick={() => addItem(clause.id)}
          >
            + Nova Subcláusula
          </button>
        </View>
      ))}

      <View tag="btn_add-clause-field">
        <button className="btn_add-clause" onClick={addClause}>
          + Nova Cláusula
        </button>
      </View>
    </View>
  );
};

export default ClauseManager;
