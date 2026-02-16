import React, { useState, useEffect, useRef } from "react";
import styles from "./AppBar.module.css";
import BackButton from "../BackButton/BackButton";
import Text from "../Text/Text";

const AppBar = ({ title, actions = [] }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Fecha o menu ao clicar fora (fidelidade à lógica original)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const renderLogoOrTitle = () => {
    if (title) {
      return (
        <Text
          font="GodOfThunder"
          size="1.4rem"
          shadowStroke="5px"
          color="#ffffff"
          shadow="var(--sv-sodalita)"
        >
          {title}
        </Text>
      );
    }

    // Logo padrão "eletrica & art"
    return (
      <>
        <Text
          font="GodOfThunder"
          size="1.4rem"
          shadowStroke="5px"
          color="#ffffff"
          shadow="var(--sv-sodalita)"
        >
          eletrica{" "}
        </Text>
        <Text
          font="GodOfThunder"
          size=".8rem"
          shadowStroke="5px"
          color="#ffab00"
          shadow="var(--sv-sodalita)"
        >
          &nbsp;
        </Text>
        <Text
          font="GodOfThunder"
          size="1.4rem"
          shadowStroke="5px"
          color="#ffab00"
          shadow="var(--sv-sodalita)"
        >
          &
        </Text>
        <Text
          font="GodOfThunder"
          size=".8rem"
          shadowStroke="5px"
          color="#ffab00"
          shadow="var(--sv-sodalita)"
        >
          &nbsp;
        </Text>
        <Text
          font="GodOfThunder"
          size="1.4rem"
          shadowStroke="5px"
          color="#ffffff"
          shadow="var(--sv-sodalita)"
        >
          {" "}
          art
        </Text>
      </>
    );
  };

  return (
    <appbar className={styles.appbar}>
      <div className={styles.ui}>
        <div className={styles.navigationSlot}>
          <BackButton />
        </div>

        <main className={styles.titleSlot}>{renderLogoOrTitle()}</main>

        <div
          className={styles.actionsSlot}
          ref={menuRef}
          style={{ visibility: actions.length > 0 ? "visible" : "hidden" }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className={styles.dots}>⋮</div>

          {isMenuOpen && (
            <div className={styles.dropdown}>
              {actions.map((act, index) => (
                <button
                  key={index}
                  className={styles.vmenuItem}
                  onClick={(e) => {
                    e.stopPropagation();
                    act.action();
                    setIsMenuOpen(false);
                  }}
                >
                  <span>{act.icon}</span> {act.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </appbar>
  );
};

export default AppBar;
