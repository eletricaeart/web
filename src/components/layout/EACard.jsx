import React from "react";
import "./EACard.css";

const EACard = () => {
  // Caminhos ajustados para a estrutura de assets do Vite
  const logos = {
    local: "assets/imgs/favicons/EA-logo.png",
    name: "assets/imgs/ea/ea-Name.png",
  };

  return (
    <div className="ea-card-container">
      <div className="ea-logo-zone">
        <img src={logos.local} alt="Logo Elétrica & Art" />
      </div>

      <div className="ea-description-zone">
        <div className="ea-name-img">
          <img src={logos.name} alt="Elétrica & Art" />
        </div>

        <div
          className="ea-card-info-text"
          style={{ fontWeight: 500, fontSize: "0.8em" }}
        >
          CNPJ 32.858.892/0001-52 - IM 67358/0001
        </div>

        <div className="ea-card-info-text">
          Rua José Alves Maciel, 40 - Aviação <br />
          Praia Grande - São Paulo - SP - Cep 11702-440
        </div>

        <div className="ea-card-info-text">
          <a href="tel:+5513997685853">
            <strong>Fone </strong> (13) 99768-5853
          </a>{" "}
          <br />
          <a
            href="https://wa.me/5513997685853"
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>Whatsapp </strong> (13) 99768-5853
          </a>{" "}
          <br />
          <a href="mailto:rafa.julia.forever@gmail.com">
            <strong>E-mail </strong> rafa.julia.forever@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default EACard;
