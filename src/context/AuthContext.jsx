// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import SecureLS from "secure-ls";

const ls = new SecureLS({ encodingType: "aes" });
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca o usuário/token criptografado no carregamento
    const savedUser = ls.get("ea_user_session");
    if (savedUser) setUser(savedUser);
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    // Aqui faremos a chamada para o seu backend JWT futuramente
    // Por enquanto, simulamos o sucesso:
    const mockUser = { id: 1, name: "Rafael", token: "JWT_TOKEN_GERADO" };
    ls.set("ea_user_session", mockUser);
    setUser(mockUser);
  };

  const logout = () => {
    ls.remove("ea_user_session");
    ls.removeAll(); // Limpa rascunhos e caches por segurança
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
