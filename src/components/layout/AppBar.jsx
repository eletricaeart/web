import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AppBar.css";
import EAText from "../EAText"; // Assumindo o caminho do componente de texto
import View from "./View";

const AppBar = ({ actions = [], customTitle = null }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fecha o menu ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleActionClick = (action) => {
    setIsMenuOpen(false);
    if (typeof action === "function") {
      action();
    } else {
      navigate(action);
    }
  };

  return (
    <View tag="appbar" className="app-bar">
      <View tag="navigation-slot"></View>
      <View
        tag="main-slot"
        className="logo-container"
        onClick={() => navigate("/")}
      >
        {customTitle ? (
          <EAText
            font="GodOfThunder"
            size="1.4rem"
            shadowStroke="5px"
            color="#ffffff"
            shadow="var(--sv-sodalita)"
          >
            {customTitle}
          </EAText>
        ) : (
          <>
            <EAText
              font="GodOfThunder"
              size="1.4rem"
              shadowStroke="5px"
              color="#ffffff"
              shadow="var(--sv-sodalita)"
            >
              Eletrica
            </EAText>
            <EAText
              font="GodOfThunder"
              size=".8rem"
              shadowStroke="5px"
              color="#ffab00"
              shadow="var(--sv-sodalita)"
            >
              &
            </EAText>
            <EAText
              font="GodOfThunder"
              size="1.4rem"
              shadowStroke="5px"
              color="#ffffff"
              shadow="var(--sv-sodalita)"
            >
              Art
            </EAText>
          </>
        )}
      </View>

      <View tag="actions-slot">
        {actions && actions.length > 0 && (
          <View className="vmenu-container" ref={menuRef} onClick={toggleMenu}>
            <div className="vmenu-icon">⋮</div>
            <div className={`vmenu-dropdown ${isMenuOpen ? "active" : ""}`}>
              {actions.map((act, index) => (
                <button
                  key={index}
                  className="vmenu-item"
                  onClick={() => handleActionClick(act.action)}
                >
                  <span>{act.icon}</span> {act.label}
                </button>
              ))}
            </div>
          </View>
        )}
      </View>
    </View>
  );
};

export default AppBar;
