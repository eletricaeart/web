// src/pages/Login/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import View from "@/components/layout/View";
import {
  CircleNotch,
  Lock,
  User,
  EnvelopeSimple,
  Lightning,
} from "@phosphor-icons/react";
import "./Login.css";
import { toast } from "sonner";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // passamos email e password separadamente
    const result = await login(credentials.email, credentials.password);

    if (result.success) {
      toast.success("Acesso autorizado!", {
        description: "Bem-vindo de volta.",
      });
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      toast.error("Falha no login", { description: result.message }); // "E-mail ou senha incorretos"
    }
    setLoading(false);
  };

  return (
    <View tag="login-page" className="login-wrapper">
      <div className="login-background-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <View tag="login-card" className="login-card">
        <header className="login-header">
          <div className="login-logo">
            <Lightning size={32} weight="duotone" className="text-white" />
          </div>
          <h1 className="company-name">Elétrica & Art</h1>
          <p className="login-subtitle">Sistema de Gestão Profissional</p>
        </header>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>E-mail Corporativo</label>
            <div className="input-wrapper">
              <EnvelopeSimple className="input-icon" size={22} weight="light" />
              <input
                type="email"
                required
                placeholder="rafael@eletrica.com"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
              />
            </div>
          </div>

          <div className="input-group">
            <label>Senha de Acesso</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={22} weight="light" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="login-button">
            {loading ? (
              <CircleNotch size={24} className="animate-spin" />
            ) : (
              <>
                <span>Acessar Painel</span>
              </>
            )}
          </button>
        </form>
      </View>

      <footer className="login-footer">
        <p>Elétrica & Art &copy; 2026</p>
        <span className="dot"></span>
        <p>Praia Grande - SP</p>
      </footer>
    </View>
  );
}
