import React, { createContext, useState, useEffect, useContext } from "react";
import SecureLS from "secure-ls";
import EASync from "../services/EASync";

// Configuração do LocalStorage Criptografado
const ls = new SecureLS({ encodingType: "aes" });
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tenta recuperar a sessão criptografada ao carregar o app
    const savedUser = ls.get("ea_user_session");
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Puxa a lista de usuários da aba 'usuarios' do GS
      const usersList = await EASync.pull("usuarios");

      // Procura o usuário que bate com e-mail e senha
      const foundUser = usersList.find(
        (u) => u.email === email && String(u.password) === String(password),
      );

      if (foundUser) {
        // Removemos a senha antes de salvar no LS por segurança
        const sessionData = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
        };

        ls.set("ea_user_session", sessionData);
        setUser(sessionData);
        return { success: true };
      } else {
        return { success: false, message: "E-mail ou senha incorretos." };
      }
    } catch (error) {
      console.error("Erro no login:", error);
      return {
        success: false,
        message: "Erro ao conectar com o banco de dados.",
      };
    }
  };

  const logout = () => {
    ls.remove("ea_user_session");
    // Limpamos também os caches de orçamentos/clientes por privacidade ao deslogar
    ls.removeAll();
    setUser(null);
    window.location.href = "#/login"; // Garante o redirecionamento
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
