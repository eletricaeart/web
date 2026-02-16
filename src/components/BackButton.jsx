Bimport React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BackButton.css';

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Registra a navegação atual na pilha (Compatível com sua lógica original)
  useEffect(() => {
    const registerNavigation = () => {
      // Pega o caminho atual + query strings (?id=...)
      const currentPage = location.pathname + location.search;
      let stack = JSON.parse(localStorage.getItem("nav_stack")) || [];

      // Evita duplicar a mesma página consecutivamente
      if (stack[stack.length - 1] !== currentPage) {
        stack.push(currentPage);
        localStorage.setItem("nav_stack", JSON.stringify(stack));
      }
    };

    registerNavigation();
  }, [location]);

  // 🔹 Controla o retorno inteligente
  const goBack = () => {
    let stack = JSON.parse(localStorage.getItem("nav_stack")) || [];

    // 1. Remove a página atual da pilha
    stack.pop();

    // 2. Limpa duplicatas acidentais no topo
    while (
      stack.length > 0 &&
      stack[stack.length - 1] === (location.pathname + location.search)
    ) {
      stack.pop();
    }

    // 3. Obtém a página anterior
    const previousPage = stack.pop();

    // Atualiza a pilha no storage
    localStorage.setItem("nav_stack", JSON.stringify(stack));

    if (previousPage) {
      // Navega para a URL completa (preservando IDs)
      navigate(previousPage);
    } else {
      // Fallback seguro caso a pilha esteja vazia
      navigate('/');
    }
  };

  return (
    <div className="back-button-container">
      <button 
        className="back-button-trigger" 
        onClick={goBack}
        title="Voltar"
      >
        <svg className="arrow-back-svg" viewBox="0 0 24 24">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
      </button>
    </div>
  );
};

export default BackButton;ackButton.jsx;
