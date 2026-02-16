import React from "react";
import { useNavigate } from "react-router-dom";
import { Ghost, House } from "@phosphor-icons/react"; // Ícones Phosphor modernos
import "./NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="ghost-animation">
          <Ghost size={120} weight="duotone" />
        </div>

        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Ops! Página não encontrada</h2>
        <p className="not-found-text">
          Parece que esse caminho não existe ou foi removido. Que tal voltar
          para o início?
        </p>

        <button
          className="btn-back-home"
          onClick={() => navigate("/dashboard")}
        >
          <House size={24} weight="bold" />
          VOLTAR PARA O INÍCIO
        </button>
      </div>
    </div>
  );
}
