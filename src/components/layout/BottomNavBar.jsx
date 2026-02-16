import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
// import { Home, Users, FileText, StickyNote } from "lucide-react"; // Importação dos ícones modernos
import {
  House,
  HouseLineIcon,
  Users,
  FileText,
  Notebook,
} from "@phosphor-icons/react";
import "./BottomNavBar.css";

const BottomNavBar = () => {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const initialHeight = window.innerHeight;
    const handleResize = () => {
      if (window.innerHeight < initialHeight * 0.8) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className={`bottom-nav ${isHidden ? "nav-hidden" : ""}`}>
      <NavLink
        to="/"
        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        end
      >
        <content>
          {/* <Home size={24} strokeWidth={2.5} className="nav-icon" /> */}
          <HouseLineIcon size={28} weight="duotone" className="nav-icon" />
        </content>
      </NavLink>

      <NavLink
        to="/clientes"
        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
      >
        <content>
          {/* <Users size={24} strokeWidth={2.5} className="nav-icon" /> */}
          <Users size={28} weight="duotone" className="nav-icon" />
        </content>
      </NavLink>

      <NavLink
        to="/budgets"
        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
      >
        <content>
          {/* <FileText size={24} strokeWidth={2.5} className="nav-icon" /> */}
          <FileText size={28} weight="duotone" className="nav-icon" />
        </content>
      </NavLink>

      <NavLink
        to="/notes"
        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
      >
        <content>
          {/* <StickyNote size={24} strokeWidth={2.5} className="nav-icon" /> */}
          <Notebook size={28} weight="duotone" className="nav-icon" />
        </content>
      </NavLink>
    </nav>
  );
};

export default BottomNavBar;
