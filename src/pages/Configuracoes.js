import React from 'react';

function Configuracoes() {
  return (
    <div>
      <h2>Configurações</h2>
      <div style={{margin: '16px 0'}}>
        <strong>Dados do usuário:</strong>
        <div style={{background: '#e3e3e3', borderRadius: 8, padding: 12, margin: '8px 0'}}>[Seu nome e email]</div>
      </div>
      <div style={{margin: '16px 0'}}>
        <strong>Preferências:</strong>
        <div style={{background: '#e3e3e3', borderRadius: 8, padding: 12, margin: '8px 0'}}>
          <label><input type="checkbox" /> Receber alertas de desempenho</label><br/>
          <label><input type="checkbox" /> Tema escuro</label>
        </div>
      </div>
      <div style={{margin: '16px 0'}}>
        <strong>Backup e exportação de dados:</strong>
        <div style={{background: '#e3e3e3', borderRadius: 8, padding: 12, margin: '8px 0'}}>
          <button style={{background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer'}}>Exportar dados</button>
          <button style={{background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', marginLeft: 8, cursor: 'pointer'}}>Importar dados</button>
        </div>
      </div>
      <div style={{margin: '16px 0'}}>
        <strong>Integração:</strong>
        <div style={{background: '#e3e3e3', borderRadius: 8, padding: 12, margin: '8px 0'}}>
          <button style={{background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer'}}>Conectar com Firebase</button>
        </div>
      </div>
    </div>
  );
}

export default Configuracoes;
