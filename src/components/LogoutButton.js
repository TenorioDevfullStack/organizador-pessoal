import React from "react";
import { useAuth } from "../contexts/AuthContext";

function LogoutButton() {
  const { logout, currentUser } = useAuth();

  if (!currentUser) return null;

  return (
    <button onClick={logout} style={{ marginLeft: 16, background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}>
      Sair
    </button>
  );
}

export default LogoutButton;
