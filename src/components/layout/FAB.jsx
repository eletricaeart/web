import React, { useState, useEffect } from "react";
import "./FAB.css";

const FAB = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const isArray = Array.isArray(config);

  useEffect(() => {
    const initialHeight = window.innerHeight;
    const handleResize = () => {
      setIsKeyboardOpen(window.innerHeight < initialHeight * 0.8);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleFab = () => setIsOpen(!isOpen);

  const handleAction = (optAction) => {
    setIsOpen(false);
    if (typeof optAction === "function") optAction();
    else window.location.href = optAction;
  };

  return (
    <>
      <div
        className={`fab-blur-overlay ${isOpen ? "active" : ""}`}
        onClick={toggleFab}
      />
      <div className={`fab-container ${isKeyboardOpen ? "shift-down" : ""}`}>
        <button
          className={`main-fab ${isOpen ? "active" : ""}`}
          onClick={isArray ? toggleFab : () => handleAction(config.action)}
        >
          {isArray ? "+" : config.icon}
        </button>

        {isArray && isOpen && (
          <div className="fab-options">
            {config.map((opt, i) => (
              <div
                key={i}
                className={`fab-option-item ${isOpen ? "show" : ""}`}
                style={{ transitionDelay: `${i * 50}ms` }}
                onClick={() => handleAction(opt.action)}
              >
                <span className="fab-label">{opt.label}</span>
                <button className="fab-mini">{opt.icon}</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FAB;
