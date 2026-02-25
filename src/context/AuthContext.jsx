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
    // 1. Aqui você fará a chamada para validar no seu backend futuramente
    // Exemplo: const response = await EASyncService.login(credentials);

    // 2. Por enquanto, vamos colocar uma validação fixa para você testar a segurança:
    if (
      credentials.email === "rafael@eletrica.com" &&
      credentials.password === "art123"
    ) {
      const userSession = {
        id: 1,
        name: "Rafael",
        email: credentials.email,
        token: "JWT_" + Math.random().toString(36).substr(2), // Simula um token
      };

      // Salva de forma criptografada no LocalStorage
      ls.set("ea_user_session", userSession);
      setUser(userSession);
      return { success: true };
    } else {
      // Se as credenciais estiverem erradas, lançamos um erro
      throw new Error("Usuário ou senha inválidos");
    }
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
