import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Ganhos from "./pages/Ganhos";
import Gastos from "./pages/Gastos";
import DespesasFixas from "./pages/DespesasFixas";
import Metas from "./pages/Metas";
import Configuracoes from "./pages/Configuracoes";
import Auth from "./pages/Auth";
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LogoutButton from './components/LogoutButton';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();
  if (!currentUser) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <nav className="main-nav">
            <Link to="/">Dashboard</Link>
            <Link to="/ganhos">Ganhos</Link>
            <Link to="/gastos">Gastos</Link>
            <Link to="/despesas-fixas">Despesas Fixas</Link>
            <Link to="/metas">Metas</Link>
            <Link to="/configuracoes">Configurações</Link>
            <LogoutButton />
          </nav>
          <div className="content">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/ganhos" element={<PrivateRoute><Ganhos /></PrivateRoute>} />
              <Route path="/gastos" element={<PrivateRoute><Gastos /></PrivateRoute>} />
              <Route path="/despesas-fixas" element={<PrivateRoute><DespesasFixas /></PrivateRoute>} />
              <Route path="/metas" element={<PrivateRoute><Metas /></PrivateRoute>} />
              <Route path="/configuracoes" element={<PrivateRoute><Configuracoes /></PrivateRoute>} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
