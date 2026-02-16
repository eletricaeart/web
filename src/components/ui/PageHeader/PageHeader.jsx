import React from "react";
import Text from "../Text/Text";
import styles from "./PageHeader.module.css";

/**
 * Componente PageHeader (antigo <page-header>)
 * @param {string} children - O título da página
 * @param {boolean} center - Se o título deve ser centralizado
 * @param {string} shadow - Cor da sombra/contorno do texto
 */
const PageHeader = ({ children, center, shadow }) => {
  return (
    <header className={`${styles.header} ${center ? styles.center : ""}`}>
      <Text
        color="var(--sv-sombra-azul)"
        shadow={shadow || "#9fabb555"}
        size="1.5rem"
      >
        {children}
      </Text>
    </header>
  );
};

export default PageHeader;
