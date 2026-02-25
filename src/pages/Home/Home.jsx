// src/pages/Home/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FilePlus, ListChecks, Users, SignOut } from "@phosphor-icons/react";
import View from "@/components/layout/View";

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <View tag="home-page" className="p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Olá, {user?.name}!
        </h1>
        <p className="text-slate-500">
          O que vamos fazer hoje na Elétrica & Art?
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => navigate("/novo-orcamento")}
          className="home-card bg-blue-600 text-white"
        >
          <FilePlus size={32} weight="duotone" />
          <span>Novo Orçamento</span>
        </button>
        <button
          onClick={() => navigate("/budgets")}
          className="home-card bg-white text-slate-700 border"
        >
          <ListChecks size={32} weight="duotone" className="text-blue-600" />
          <span>Orçamentos</span>
        </button>
        <button
          onClick={() => navigate("/clientes")}
          className="home-card bg-white text-slate-700 border"
        >
          <Users size={32} weight="duotone" className="text-blue-600" />
          <span>Clientes</span>
        </button>
        <button onClick={logout} className="home-card bg-red-50 text-red-600">
          <SignOut size={32} weight="duotone" />
          <span>Sair</span>
        </button>
      </div>
    </View>
  );
}
