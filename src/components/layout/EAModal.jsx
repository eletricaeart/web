import React from "react";
import "./EAModal.css";

const EAModal = ({
  isOpen,
  title,
  message,
  type = "confirm",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className={`ea-modal-overlay ${isOpen ? "active" : ""}`}>
      <div className="ea-modal-card">
        <header className="ea-modal-header">{title}</header>
        <div
          className="ea-modal-body"
          dangerouslySetInnerHTML={{ __html: message }}
        />
        <footer className="ea-modal-footer">
          {(type === "confirm" || type === "danger") && (
            <button
              className="ea-modal-btn ea-modal-btn-cancel"
              onClick={onCancel}
            >
              CANCELAR
            </button>
          )}
          <button
            className={`ea-modal-btn ${type === "danger" ? "ea-modal-btn-danger" : "ea-modal-btn-confirm"}`}
            onClick={onConfirm}
          >
            {type === "alert" ? "ENTENDI" : "CONFIRMAR"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default EAModal;
