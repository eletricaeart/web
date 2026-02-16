import React, { useState } from "react";
import styles from "./FloatingActions.module.css";

/**
 * Componente FloatingActions (antigo FAB.js)
 * @param {Array} actions - Lista de objetos { icon, label, action }
 */
const FloatingActions = ({ actions = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFab = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Overlay de Desfoque */}
      {isOpen && <div className={styles.blurOverlay} onClick={toggleFab} />}

      <div className={styles.fabContainer}>
        {/* Botão Principal */}
        <button
          className={`${styles.fab} ${isOpen ? styles.fabActive : ""}`}
          onClick={toggleFab}
        >
          {isOpen ? "+" : actions.length > 1 ? "+" : actions[0]?.icon}
        </button>

        {/* Lista de Opções */}
        {isOpen && actions.length > 1 && (
          <div className={styles.fabOptions}>
            {actions.map((opt, index) => (
              <div
                key={index}
                className={styles.optionItem}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => {
                  opt.action();
                  setIsOpen(false);
                }}
              >
                <span className={styles.label}>{opt.label}</span>
                <button className={styles.miniFab}>{opt.icon}</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FloatingActions;
