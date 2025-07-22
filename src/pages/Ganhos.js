import React, { useState, useEffect } from 'react';
import { listarGanhos, adicionarGanho, atualizarGanho, deletarGanho } from '../services/ganhosService';

const origens = ['Uber', '99', 'Pix', 'Dinheiro', 'Outros'];

function Ganhos() {
  const [ganhos, setGanhos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ data: '', origem: origens[0], valor: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  const total = ganhos.reduce((acc, g) => acc + Number(g.valor), 0);

  useEffect(() => {
    async function fetchGanhos() {
      setLoading(true);
      const data = await listarGanhos();
      setGanhos(data);
      setLoading(false);
    }
    fetchGanhos();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.data || !form.origem || !form.valor) return;
    if (editIndex !== null && editId) {
      // Atualizar no Firestore
      await atualizarGanho(editId, { ...form, valor: Number(form.valor) });
    } else {
      // Adicionar no Firestore
      await adicionarGanho({ ...form, valor: Number(form.valor) });
    }
    // Recarregar lista
    const data = await listarGanhos();
    setGanhos(data);
    setForm({ data: '', origem: origens[0], valor: '' });
    setShowModal(false);
    setEditIndex(null);
    setEditId(null);
  }

  function handleEdit(idx) {
    setEditIndex(idx);
    setEditId(ganhos[idx].id);
    setForm({ ...ganhos[idx], valor: ganhos[idx].valor.toString() });
    setShowModal(true);
  }

  async function handleDelete(idx) {
    if (window.confirm('Deseja realmente excluir este ganho?')) {
      await deletarGanho(ganhos[idx].id);
      const data = await listarGanhos();
      setGanhos(data);
    }
  }

  return (
    <div>
      <h2>Ganhos</h2>
      <div style={{margin: '16px 0'}}>
        <label><strong>Filtrar por período:</strong> <input type="date" /> até <input type="date" /></label>
      </div>
      <div style={{margin: '16px 0', textAlign: 'right'}}>
        <button onClick={() => setShowModal(true)} style={{background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer'}}>+ Adicionar Ganho</button>
      </div>
      <div style={{margin: '16px 0'}}>
        <strong>Total de ganhos:</strong> R$ {total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
      </div>
      <ul style={{background: '#e3e3e3', borderRadius: 8, padding: 16, color: '#444'}}>
        {ganhos.length === 0 && <li>Nenhum ganho cadastrado.</li>}
        {ganhos.map((g, i) => (
          <li key={i} style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:8}}>
            <span>{g.data} - {g.origem} - R$ {g.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
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
            <h3>{editIndex !== null ? 'Editar Ganho' : 'Novo Ganho'}</h3>
            <label>Data: <input type="date" name="data" value={form.data} onChange={handleChange} required /></label>
            <label>Origem: <select name="origem" value={form.origem} onChange={handleChange}>{origens.map(o => <option key={o}>{o}</option>)}</select></label>
            <label>Valor (R$): <input type="number" name="valor" value={form.valor} onChange={handleChange} min="0" step="0.01" required /></label>
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

export default Ganhos;
