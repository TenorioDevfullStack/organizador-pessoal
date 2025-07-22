import React, { useState, useEffect } from 'react';
import { listarMetas, adicionarMeta, atualizarMeta, deletarMeta } from '../services/metasService';

function Metas() {
  const [metas, setMetas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nome: '', valor: '', progresso: 0 });
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetas() {
      setLoading(true);
      const data = await listarMetas();
      setMetas(data);
      setLoading(false);
    }
    fetchMetas();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nome || !form.valor) return;
    if (editIndex !== null && editId) {
      // Atualizar no Firestore
      await atualizarMeta(editId, { ...form, valor: Number(form.valor), progresso: Number(form.progresso) });
    } else {
      // Adicionar no Firestore
      await adicionarMeta({ ...form, valor: Number(form.valor), progresso: Number(form.progresso) });
    }
    // Recarregar lista
    const data = await listarMetas();
    setMetas(data);
    setForm({ nome: '', valor: '', progresso: 0 });
    setShowModal(false);
    setEditIndex(null);
    setEditId(null);
  }

  function handleEdit(idx) {
    setEditIndex(idx);
    setEditId(metas[idx].id);
    setForm({ ...metas[idx], valor: metas[idx].valor.toString(), progresso: metas[idx].progresso.toString() });
    setShowModal(true);
  }

  async function handleDelete(idx) {
    if (window.confirm('Deseja realmente excluir esta meta?')) {
      await deletarMeta(metas[idx].id);
      const data = await listarMetas();
      setMetas(data);
    }
  }

  return (
    <div>
      <h2>Metas</h2>
      <div style={{margin: '16px 0', textAlign: 'right'}}>
        <button onClick={() => setShowModal(true)} style={{background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer'}}>+ Adicionar Meta</button>
      </div>
      <ul style={{background: '#e3e3e3', borderRadius: 8, padding: 16, color: '#444'}}>
        {metas.length === 0 && <li>Nenhuma meta cadastrada.</li>}
        {metas.map((m, i) => (
          <li key={i} style={{marginBottom: 16, display:'flex', alignItems:'center', justifyContent:'space-between', gap:8}}>
            <span>
              <div><strong>{m.nome}:</strong> R$ {m.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
              <div style={{background: '#fff', borderRadius: 4, height: 12, margin: '8px 0', width: '100%', boxShadow: '0 1px 2px #ccc inset'}}>
                <div style={{width: `${m.progresso}%`, height: '100%', background: '#1976d2', borderRadius: 4}}></div>
              </div>
              <div>Progresso: {m.progresso}%</div>
            </span>
            <span>
              <button onClick={() => handleEdit(i)} style={{marginRight:4, background:'#bbb', border:'none', borderRadius:4, padding:'2px 8px', cursor:'pointer'}}>Editar</button>
              <button onClick={() => handleDelete(i)} style={{background:'#d32f2f', color:'#fff', border:'none', borderRadius:4, padding:'2px 8px', cursor:'pointer'}}>Excluir</button>
            </span>
          </li>
        ))}
      </ul>
      {showModal && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10}}>
          <form onSubmit={handleSubmit} style={{background: '#fff', padding: 24, borderRadius: 8, minWidth: 280, boxShadow: '0 4px 16px #0002', display: 'flex', flexDirection: 'column', gap: 12}}>
            <h3>{editIndex !== null ? 'Editar Meta' : 'Nova Meta'}</h3>
            <label>Nome: <input type="text" name="nome" value={form.nome} onChange={handleChange} required /></label>
            <label>Valor (R$): <input type="number" name="valor" value={form.valor} onChange={handleChange} min="0" step="0.01" required /></label>
            <label>Progresso inicial (%): <input type="number" name="progresso" value={form.progresso} onChange={handleChange} min="0" max="100" /></label>
            <div style={{display: 'flex', justifyContent: 'flex-end', gap: 8}}>
              <button type="button" onClick={() => {setShowModal(false); setEditIndex(null);}} style={{background: '#bbb', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer'}}>Cancelar</button>
              <button type="submit" style={{background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer'}}>Salvar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Metas;
