import React, { useEffect } from "react";
import styles from "./BackButton.module.css";

const BackButton = () => {
  useEffect(() => {
    registerNavigation();
  }, []);

  const registerNavigation = () => {
    // Captura a página atual + query strings (ex: ?edit=true)
    const currentPage =
      window.location.pathname.split("/").pop() + window.location.search;

    let stack = JSON.parse(localStorage.getItem("nav_stack")) || [];

    // Evita duplicar a mesma página consecutivamente
    if (stack[stack.length - 1] !== currentPage) {
      stack.push(currentPage);
      localStorage.setItem("nav_stack", JSON.stringify(stack));
    }
  };

  const goBack = () => {
    let stack = JSON.parse(localStorage.getItem("nav_stack")) || [];

    // Remove a página atual
    stack.pop();

    // Remove possíveis duplicatas consecutivas para evitar loops
    const currentPath = window.location.pathname.split("/").pop();
    while (
      stack.length > 0 &&
      stack[stack.length - 1].split("?")[0] === currentPath
    ) {
      stack.pop();
    }

    const previousPage = stack.pop();
    localStorage.setItem("nav_stack", JSON.stringify(stack));

    if (previousPage) {
      window.location.href = previousPage;
    } else {
      // Fallback para a Dashboard conforme original
      window.location.href = "dashboard.html";
    }
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.backButton}
        onClick={goBack}
        aria-label="Voltar"
      >
        <svg className={styles.arrowBack} viewBox="0 0 24 24">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
        </svg>
      </button>
    </div>
  );
};

export default BackButton;
