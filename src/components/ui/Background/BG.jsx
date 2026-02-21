import React from "react";
import "./BG.css";

export default function HeroBanner({ title, subtitle, buttonText }) {
  return (
    <section className="hero-container">
      {/* Camada das setas animadas em background */}
      <div className="arrows-layer"></div>

      {/* Camada de overlay para garantir contraste do texto */}
      <div className="overlay-dark"></div>

      <div className="hero-content">
        <h1 className="hero-title">{title || "NOME DO PROJETO"}</h1>
        <p className="hero-subtitle">
          {subtitle || "Sua descrição curta aqui."}
        </p>
        <button className="hero-button">{buttonText || "Começar"}</button>
      </div>
    </section>
  );
}
