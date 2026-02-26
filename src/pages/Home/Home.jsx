// src/pages/Home/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FilePlus, ListChecks, Users, SignOut } from "@phosphor-icons/react";
import View from "@/components/layout/View";
import BottomNavBar from "@/components/layout/BottomNavBar";
import AppBar from "@/components/layout/AppBar";
import HomePage from "@/components/layout/HomePage";

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirm = window.confirm("Deseja realmente sair do sistema?");
    if (confirm) {
      logout(); // Isso limpa o SecureLS e o estado do usuário
      // O ProtectedRoute no App.jsx cuidará do redirecionamento automático
    }
  };

  const appbarActions = [
    {
      icon: <SignOut size={32} weight="duotone" />,
      label: "Sair",
      action: () => {
        handleLogout();
      },
    },
  ];

  return (
    <>
      <AppBar actions={appbarActions} />
      <HomePage>
        <header className="pb-[5rem]">
          <h1 className="text-2xl font-bold text-slate-800">
            Olá, {user?.name}!
          </h1>
          <p className="text-slate-500">
            O que vamos fazer hoje na Elétrica & Art?
          </p>
        </header>

        <View tag="spacer" className="flex w-full h-[5rem]" />

        <div className="grid grid-cols-2 gap-4">
          <View
            tag="home-btn"
            onClick={() => navigate("/novo-orcamento")}
            className="home-card bg-white flex flex-col items-center justify-center gap-5 text-slate-700 aspect-[3/2.5] rounded-2xl"
          >
            <FilePlus size={32} weight="duotone" />
            <span>Novo Orçamento</span>
          </View>
          <View
            tag="home-btn"
            onClick={() => navigate("/budgets")}
            className="home-card bg-white flex flex-col items-center justify-center gap-5 text-slate-700 aspect-[3/2.5] rounded-2xl"
          >
            <ListChecks size={32} weight="duotone" className="text-blue-600" />
            <span>Orçamentos</span>
          </View>
          <View
            tag="home-btn"
            onClick={() => navigate("/clientes")}
            className="home-card bg-white flex flex-col items-center justify-center gap-5 text-slate-700 aspect-[3/2.5] rounded-2xl"
          >
            <Users size={32} weight="duotone" className="text-blue-600" />
            <span>Clientes</span>
          </View>
        </div>
      </HomePage>
      <BottomNavBar />
    </>
  );
}
