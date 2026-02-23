/**
 * -- [ App.jsx ]
 *  */

import React from "react";
import {
  BrowserRouter as Router,
  // HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// import AppBar from "./components/layout/AppBar";
// import BottomNavBar from "./components/layout/BottomNavBar";

// Importação das Páginas (Arquivos de Página)
import ClientesLista from "./pages/Clientes/ClientesLista";
import ClientePerfil from "./pages/Clientes/ClientePerfil";
import ClienteCaptura from "./pages/Clientes/ClienteCaptura";
import NotesLista from "./pages/Notes/NotesLista";
import NoteView from "./pages/Notes/NoteView";
import NoteEditor from "./pages/Notes/NoteEditor";
import Budgets from "./pages/Budget/Budgets";
import NewBudget from "./pages/Budget/NewBudget";
import Budget from "./pages/Budget/Budget";

import NotFound from "./pages/NotFound/NotFound";
import ClienteEditar from "./pages/Clientes/ClienteEditar";

/**
 * --- [ default: App ]
 *  */
export default function App() {
  return (
    <Router>
      {/* AppBar fixa no topo */}
      {/* <AppBar /> */}

      <Routes>
        {/* Rota Raiz: Redireciona para Dashboard ou define como principal */}
        <Route path="/" element={<Navigate to="/budgets" replace />} />

        {/* Orçamentos */}
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/novo-orcamento" element={<NewBudget />} />
        <Route path="/orcamento" element={<Budget />} />

        {/* Clientes */}
        <Route path="/clientes" element={<ClientesLista />} />
        <Route path="/cliente" element={<ClientePerfil />} />
        <Route path="/cliente/novo" element={<ClienteCaptura />} />
        <Route path="/cliente/editar" element={<ClienteEditar />} />

        {/* Notas */}
        <Route path="/notes" element={<NotesLista />} />
        <Route path="/notes/view/:id" element={<NoteView />} />
        <Route path="/notes/new" element={<NoteEditor />} />
        <Route path="/notes/edit/:id" element={<NoteEditor />} />

        {/* Not Found */}
        <Route path="/NotFound" element={<NotFound />} />

        {/* Rota de Fallback (404) */}
        <Route path="*" element={<Navigate to="/NotFound" replace />} />
      </Routes>

      {/* Barra de Navegação Inferior fixa */}
      {/* <BottomNavBar /> */}
    </Router>
  );
}
