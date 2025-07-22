import React, { useEffect, useState } from 'react';
import { listarGanhos } from '../services/ganhosService';
import { listarGastos } from '../services/gastosService';
import { listarDespesasFixas } from '../services/despesasFixasService';
import { listarMetas } from '../services/metasService';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const COLORS = ['#1976d2', '#d32f2f', '#ffa726', '#43a047'];

function Dashboard() {
  const [ganhos, setGanhos] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [despesasFixas, setDespesasFixas] = useState([]);
  const [metas, setMetas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setGanhos(await listarGanhos());
      setGastos(await listarGastos());
      setDespesasFixas(await listarDespesasFixas());
      setMetas(await listarMetas());
      setLoading(false);
    }
    fetchAll();
  }, []);

  // Cálculos
  const totalGanhos = ganhos.reduce((acc, g) => acc + Number(g.valor || 0), 0);
  const totalGastos = gastos.reduce((acc, g) => acc + Number(g.valor || 0), 0);
  const totalDespesasFixas = despesasFixas.reduce((acc, d) => acc + Number(d.valor || 0), 0);
  const totalMetas = metas.reduce((acc, m) => acc + Number(m.valor || 0), 0);
  const saldoAtual = totalGanhos - totalGastos - totalDespesasFixas;

  // Dados para gráficos
  const pizzaData = [
    { name: 'Ganhos', value: totalGanhos },
    { name: 'Gastos', value: totalGastos },
    { name: 'Despesas Fixas', value: totalDespesasFixas },
  ];

  // Agrupamento por mês para gráfico de barras
  function agruparPorMes(lista) {
    const meses = {};
    lista.forEach(item => {
      let data = item.data || item.createdAt || '';
      let mes = data.substring(0, 7); // YYYY-MM
      if (!meses[mes]) meses[mes] = 0;
      meses[mes] += Number(item.valor || 0);
    });
    return meses;
  }
  const ganhosMes = agruparPorMes(ganhos);
  const gastosMes = agruparPorMes(gastos);
  const mesesUnicos = Array.from(new Set([...Object.keys(ganhosMes), ...Object.keys(gastosMes)])).sort();
  const barrasData = mesesUnicos.map(mes => ({
    mes,
    Ganhos: ganhosMes[mes] || 0,
    Gastos: gastosMes[mes] || 0,
  }));

  // Progresso das metas (exemplo: % do total de ganhos)
  const progressoMetas = totalMetas > 0 ? Math.min(100, Math.round((totalGanhos / totalMetas) * 100)) : 0;

  // Recentes
  const ultimosGanhos = ganhos.slice(-3).reverse();
  const ultimosGastos = gastos.slice(-3).reverse();

  return (
    <div>
      <h2>Dashboard</h2>
      {loading ? <div>Carregando...</div> : <>
        {/* Cards resumo */}
        <div style={{ display: 'flex', gap: 24, margin: '24px 0', flexWrap: 'wrap' }}>
          <ResumoCard titulo="Saldo Atual" valor={saldoAtual} cor="#1976d2" />
          <ResumoCard titulo="Ganhos" valor={totalGanhos} cor="#43a047" />
          <ResumoCard titulo="Gastos" valor={totalGastos} cor="#d32f2f" />
          <ResumoCard titulo="Despesas Fixas" valor={totalDespesasFixas} cor="#ffa726" />
          <ResumoCard titulo="Metas" valor={totalMetas} cor="#7b1fa2" />
        </div>

        {/* Gráfico de pizza */}
        <div style={{ margin: '24px 0', background: '#f9f9f9', borderRadius: 8, padding: 16 }}>
          <strong>Distribuição: Ganhos x Gastos x Despesas Fixas</strong>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pizzaData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label={({ name, value }) =>
                  value > 0 ? `${name}: R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : ''
                }
              >
                {pizzaData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={v => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de barras */}
        <div style={{ margin: '24px 0', background: '#f9f9f9', borderRadius: 8, padding: 16 }}>
          <strong>Evolução Mensal</strong>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barrasData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={v => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
              <Legend />
              <Bar dataKey="Ganhos" fill="#43a047" />
              <Bar dataKey="Gastos" fill="#d32f2f" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Progresso das metas */}
        <div style={{ margin: '24px 0' }}>
          <strong>Progresso das Metas</strong>
          <div style={{ background: '#e3e3e3', height: 40, borderRadius: 8, marginTop: 8, overflow: 'hidden' }}>
            <div style={{ width: `${progressoMetas}%`, background: '#1976d2', height: '100%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'width 1s' }}>
              {progressoMetas}%
            </div>
          </div>
        </div>

        {/* Alertas simples */}
        <div style={{ margin: '24px 0' }}>
          <strong>Alertas de desempenho</strong>
          <ul style={{ color: '#1976d2' }}>
            {saldoAtual < 0 && <li>Seu saldo está negativo!</li>}
            {progressoMetas >= 100 && <li>Parabéns! Você atingiu suas metas.</li>}
            {saldoAtual >= 0 && progressoMetas < 100 && <li>Nenhum alerta no momento.</li>}
          </ul>
        </div>

        {/* Ganhos/Gastos recentes */}
        <div style={{ margin: '24px 0' }}>
          <strong>Ganhos/Gastos Recentes</strong>
          <ul style={{ color: '#444' }}>
            {ultimosGanhos.map(g => <li key={g.id}>+R$ {Number(g.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({g.origem || g.descricao || 'Ganho'})</li>)}
            {ultimosGastos.map(g => <li key={g.id}>-R$ {Number(g.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({g.origem || g.descricao || 'Gasto'})</li>)}
            {ultimosGanhos.length === 0 && ultimosGastos.length === 0 && <li>Nenhum registro recente.</li>}
          </ul>
        </div>
      </>}
    </div>
  );
}

function ResumoCard({ titulo, valor, cor }) {
  return (
    <div style={{ minWidth: 150, flex: 1, background: cor, color: '#fff', borderRadius: 8, padding: 16, boxShadow: '0 2px 8px #0002', textAlign: 'center' }}>
      <div style={{ fontSize: 16, fontWeight: 600 }}>{titulo}</div>
      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 8 }}>R$ {Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
    </div>
  );
}


export default Dashboard;
