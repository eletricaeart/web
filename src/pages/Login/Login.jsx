// src/pages/Login/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import View from "@/components/layout/View";
import { CircleNotch, Lock, User } from "@phosphor-icons/react";
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
      toast.success("sucesso!", {
        description: "Você está sendo logado.",
      });
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      alert(result.message); // "E-mail ou senha incorretos"
    }
    setLoading(false);
  };

  return (
    <View
      tag="login-page"
      className="flex flex-col items-center justify-center min-h-svh p-6 bg-slate-50"
    >
      <View
        tag="login-card"
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50"
      >
        <header className="text-center mb-8">
          <View
            tag="logo-placeholder"
            className="w-20 h-20 bg-indigo-900 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-indigo-200"
          >
            <span className="text-white font-bold text-2xl">EA</span>
          </View>
          <h1 className="text-2xl font-bold text-slate-800">Elétrica & Art</h1>
          <p className="text-slate-500 text-sm">
            Acesse sua conta para gerenciar orçamentos
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <View className="form-field">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-1 block">
              E-mail
            </label>
            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="email"
                required
                placeholder="seu@email.com"
                className="w-full pl-12 pr-4 py-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all outline-none"
                value={credentials.email}
                // CORREÇÃO AQUI: de setBudget para setCredentials
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
              />
            </div>
          </View>

          <View className="form-field">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-1 block">
              Senha
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all outline-none"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
              />
            </div>
          </View>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-indigo-900 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {loading ? (
              <CircleNotch size={24} className="animate-spin" />
            ) : (
              "ENTRAR NO SISTEMA"
            )}
          </button>
        </form>
      </View>

      <p className="mt-8 text-slate-400 text-xs">
        &copy; 2026 Elétrica & Art - Praia Grande/SP
      </p>
    </View>
  );
}
