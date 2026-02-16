import React from "react";
import View from "../layout/View";
// import { Search } from "lucide-react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import "./SearchBar.css";

/**
 * Componente de busca inspirado no iFood
 * @param {string} placeholder - Texto de dica
 * @param {function} onSearch - Função que recebe o valor digitado
 * @param {string} value - Valor atual do input (opcional para inputs controlados)
 */

export default function SearchBar({
  placeholder = "Buscar...",
  onSearch,
  value,
}) {
  return (
    <>
      <View tag="toolbar" className="search-bar-container">
        <div className="ifood-search-wrapper">
          {/* <Search size={18} className="ifood-search-icon" /> */}
          <MagnifyingGlass
            size={20}
            weight="duotone"
            className="ifood-search-icon"
          />
          <input
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onSearch && onSearch(e.target.value)}
            spellCheck="false"
          />
        </div>
      </View>
    </>
  );
}
