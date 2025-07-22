import React, { useState, useEffect } from 'react';
import { listarDespesasFixas, adicionarDespesaFixa, atualizarDespesaFixa, deletarDespesaFixa } from '../services/despesasFixasService';

function DespesasFixas() {
  const [despesas, setDespesas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nome: '', valor: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  const total = despesas.reduce((acc, d) => acc + Number(d.valor), 0);

  useEffect(() => {
    async function fetchDespesas() {
      setLoading(true);
      const data = await listarDespesasFixas();
      setDespesas(data);
      setLoading(false);
    }
    fetchDespesas();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nome || !form.valor) return;
    if (editIndex !== null && editId) {
      // Atualizar no Firestore
      await atualizarDespesaFixa(editId, { ...form, valor: Number(form.valor) });
    } else {
      // Adicionar no Firestore
      await adicionarDespesaFixa({ ...form, valor: Number(form.valor) });
    }
    // Recarregar lista
    const data = await listarDespesasFixas();
    setDespesas(data);
    setForm({ nome: '', valor: '' });
    setShowModal(false);
    setEditIndex(null);
    setEditId(null);
  }

  function handleEdit(idx) {
    setEditIndex(idx);
    setEditId(despesas[idx].id);
    setForm({ ...despesas[idx], valor: despesas[idx].valor.toString() });
    setShowModal(true);
  }

  async function handleDelete(idx) {
    if (window.confirm('Deseja realmente excluir esta despesa fixa?')) {
      await deletarDespesaFixa(despesas[idx].id);
      const data = await listarDespesasFixas();
      setDespesas(data);
    }
  }

  return (
    <div>
      <h2>Despesas Fixas</h2>
      <div style={{margin: '16px 0', textAlign: 'right'}}>
        <button onClick={() => setShowModal(true)} style={{background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer'}}>+ Adicionar Despesa Fixa</button>
      </div>
      <div style={{margin: '16px 0'}}>
        <strong>Total de despesas fixas:</strong> R$ {total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
      </div>
      <ul style={{background: '#e3e3e3', borderRadius: 8, padding: 16, color: '#444'}}>
        {despesas.length === 0 && <li>Nenhuma despesa fixa cadastrada.</li>}
        {despesas.map((d, i) => (
          <li key={i} style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:8}}>
            <span>{d.nome} - R$ {d.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
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
            <h3>{editIndex !== null ? 'Editar Despesa Fixa' : 'Nova Despesa Fixa'}</h3>
            <label>Nome: <input type="text" name="nome" value={form.nome} onChange={handleChange} required /></label>
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

export default DespesasFixas;
