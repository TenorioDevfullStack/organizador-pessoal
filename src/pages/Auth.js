import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Auth() {
  const { login, register, currentUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/", { replace: true });
    }
  }, [currentUser, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 340, margin: "48px auto", padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0 4px 16px #0001" }}>
      <h2 style={{ textAlign: "center" }}>{isLogin ? "Entrar" : "Criar Conta"}</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label>Email:
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: "100%" }} />
        </label>
        <label>Senha:
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} style={{ width: "100%" }} />
        </label>
        {error && <div style={{ color: "#d32f2f", marginBottom: 8 }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ background: "#1976d2", color: "#fff", border: "none", borderRadius: 4, padding: "8px 0", cursor: "pointer" }}>
          {isLogin ? "Entrar" : "Criar Conta"}
        </button>
      </form>
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <button onClick={() => setIsLogin(!isLogin)} style={{ background: "none", border: "none", color: "#1976d2", cursor: "pointer" }}>
          {isLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
        </button>
      </div>
    </div>
  );
}

export default Auth;
