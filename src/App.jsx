/**
 * -- [ App.jsx ]
 *  */
import React from "react";
import {
  // BrowserRouter as Router,
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { Toaster } from "@/components/ui/sonner";

// import AppBar from "./components/layout/AppBar";
// import BottomNavBar from "./components/layout/BottomNavBar";

/* --- Importação das Páginas (Arquivos de Página)
 * */
// home
import Home from "./pages/Home/Home";
// clientes
import ClientesLista from "./pages/Clientes/ClientesLista";
import ClientePerfil from "./pages/Clientes/ClientePerfil";
import ClienteCaptura from "./pages/Clientes/ClienteCaptura";
import ClienteEditar from "./pages/Clientes/ClienteEditar";
// notas
import NotesLista from "./pages/Notes/NotesLista";
import NoteView from "./pages/Notes/NoteView";
import NoteEditor from "./pages/Notes/NoteEditor";
// orçamentos
import Budgets from "./pages/Budget/Budgets";
import NewBudget from "./pages/Budget/NewBudget";
import Budget from "./pages/Budget/Budget";

import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/Login/Login";

/**
 * --- [ default: App ]
 *  */
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* --- [ Rota com acesso livre ] --- */}
          <Route path="/login" element={<Login />} />

          {/* --- [ Rotas Protegidas ] --- */}
          {/* Raiz e Home */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Orçamentos */}
          <Route
            path="/budgets"
            element={
              <ProtectedRoute>
                <Budgets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/novo-orcamento"
            element={
              <ProtectedRoute>
                <NewBudget />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orcamento"
            element={
              <ProtectedRoute>
                <Budget />
              </ProtectedRoute>
            }
          />

          {/* Clientes */}
          <Route
            path="/clientes"
            element={
              <ProtectedRoute>
                <ClientesLista />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cliente"
            element={
              <ProtectedRoute>
                <ClientePerfil />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cliente/novo"
            element={
              <ProtectedRoute>
                <ClienteCaptura />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cliente/editar"
            element={
              <ProtectedRoute>
                <ClienteEditar />
              </ProtectedRoute>
            }
          />

          {/* Notas */}
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <NotesLista />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/view/:id"
            element={
              <ProtectedRoute>
                <NoteView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/new"
            element={
              <ProtectedRoute>
                <NoteEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/edit/:id"
            element={
              <ProtectedRoute>
                <NoteEditor />
              </ProtectedRoute>
            }
          />

          {/* Not Found - Acesso livre para o Rafael não ficar perdido se deslogar */}
          <Route path="/NotFound" element={<NotFound />} />

          {/* Rota de Fallback (404) com replace para limpar o histórico */}
          <Route path="*" element={<Navigate to="/NotFound" replace />} />
        </Routes>
      </Router>
      <Toaster position="top-center" richColors />
    </AuthProvider>
  );
}
