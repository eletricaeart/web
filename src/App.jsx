import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AppBar from "./components/layout/AppBar";
import BottomNavBar from "./components/layout/BottomNavBar";

// Importação das Páginas (Arquivos de Página)
import ClientesLista from "./pages/Clientes/ClientesLista";
import ClientePerfil from "./pages/Clientes/ClientePerfil";
import NotesLista from "./pages/Notes/NotesLista";
import NoteView from "./pages/Notes/NoteView";
import NoteEditor from "./pages/Notes/NoteEditor";
import Budgets from "./pages/Budget/Budgets";
import CapturaOrcamento from "./pages/Budget/CapturaOrcamento";
import CapturePage from "./pages/Budget/CapturePage";
import OrcamentoView from "./pages/Budget/OrcamentoView";
import Page from "./components/layout/Page";
import Home from "./pages/Home/Home";

import NotFound from "./pages/NotFound/NotFound";

function App() {
  return (
    <Router>
      {/* AppBar fixa no topo */}
      <AppBar />

      {/* <Home> */}
      {/* <main style={{ paddingBottom: "80px", minHeight: "calc(100vh - 72px)" }}> */}
      <Routes>
        {/* Rota Raiz: Redireciona para Dashboard ou define como principal */}
        <Route path="/" element={<Navigate to="/budgets" replace />} />

        {/* Orçamentos */}
        <Route path="/budgets" element={<Budgets />} />
        {/* <Route path="/captura" element={<CapturaOrcamento />} /> */}
        <Route path="/captura" element={<CapturePage />} />
        <Route path="/orcamento" element={<OrcamentoView />} />

        {/* Clientes */}
        <Route path="/clientes" element={<ClientesLista />} />
        <Route path="/cliente" element={<ClientePerfil />} />

        {/* Notas */}
        <Route path="/notes" element={<NotesLista />} />
        <Route path="/notes/view/:id" element={<NoteView />} />
        <Route path="/notes/new" element={<NoteEditor />} />
        <Route path="/notes/edit/:id" element={<NoteEditor />} />

        <Route path="/NotFound" element={<NotFound />} />

        {/* Rota de Fallback (404) */}
        <Route path="*" element={<Navigate to="/NotFound" replace />} />
      </Routes>
      {/* </main> */}
      {/* </Home> */}

      {/* Barra de Navegação Inferior fixa */}
      <BottomNavBar />
    </Router>
  );
}

export default App;
