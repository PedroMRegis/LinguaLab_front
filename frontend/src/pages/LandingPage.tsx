import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { isAfter, isBefore, parseISO } from "date-fns";
import  Card  from "@/components/proprio/Card";
import { Sidebar } from "../components/proprio/Sidebar";
import { Topbar } from "@/components/proprio/Topbar";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const Container = styled.main`
  padding: 2rem;
  background-color: #f9fafb;
  min-height: 100vh;
  font-family: sans-serif;
`;

const MetricsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ChartWrapper = styled.div`
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
`;
export type Aula = {
  id_cliente: string;
  date: string;
  price: number;
  tipo: string;
};

export type Cliente = {
  ID_Cliente: string;
  Motivo: string;
  Education: string;
  Cidade: string;
  Renda_anual: number;
  Aulas: string;
  NPS: number;
  Num_Aulas: number;
  Ano_de_nascimento: number;
  Banheiros_na_casa: number;
  Quartos_na_casa: number;
  Idade: number;
  Categoria_Renda: string;
  Faixa_Etaria: string;
};

export const Homepage: React.FC = () => {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [tipoSelecionado, setTipoSelecionado] = useState("");
  const [dataInicio, setDataInicio] = useState("2025-01-01");
  const [dataFim, setDataFim] = useState("2025-01-31");
  const [sidebarOpen, setSidebarOpen] = useState(false);


  useEffect(() => {
    const fetchDadosDaApi = async () => {
      try {
        const [resAulas, resBase] = await Promise.all([
          fetch("http://localhost:8000/aulas"),
          fetch("http://localhost:8000/base"),
        ]);

        if (!resAulas.ok) {
          throw new Error(`Erro ao buscar aulas: ${resAulas.status}`);
        }
        if (!resBase.ok) {
          throw new Error(`Erro ao buscar clientes: ${resBase.status}`);
        }

        const dadosAulas: any[] = await resAulas.json();
        const dadosBase: any[] = await resBase.json();

        setAulas(
          dadosAulas.map(a => ({ ...a, date: a.date, id_cliente: String(a.id_cliente), price: Number(a.price) }))
        );
        setClientes(
          dadosBase.map(c => ({ ...c, ID_Cliente: String(c.ID_Cliente), NPS: Number(c.NPS) }))
        );

      } catch (e: any) {
        console.error(e);
      }
    };
    fetchDadosDaApi();
  }, []);

  const aulasFiltradas = useMemo(() => {
    return aulas.filter(a => {
      const matchTipo = tipoSelecionado ? a.tipo === tipoSelecionado : true;
      const dataISO = parseISO(a.date);
      const after = isAfter(dataISO, parseISO(dataInicio));
      const before = isBefore(dataISO, parseISO(dataFim));
      return matchTipo && after && before;
    });
  }, [aulas, tipoSelecionado, dataInicio, dataFim]);

  const idsFiltrados = useMemo(
    () => new Set(aulasFiltradas.map(a => a.id_cliente)),
    [aulasFiltradas]
  );

  const npsFiltrado = useMemo(() => {
    const vals = clientes
      .filter(c => idsFiltrados.has(c.ID_Cliente))
      .map(c => c.NPS)
      .filter(n => !isNaN(n));
    return vals.length ? vals.reduce((s, n) => s + n, 0) / vals.length : 0;
  }, [clientes, idsFiltrados]);

  const faturamentoTotal = aulasFiltradas.reduce((s, a) => s + a.price, 0);

  const faturamentoPorTipo = useMemo(() => {
    const map = new Map<string, number>();
    aulasFiltradas.forEach(a => map.set(a.tipo, (map.get(a.tipo) || 0) + a.price));
    return Array.from(map, ([tipo, faturamento]) => ({ tipo, faturamento }));
  }, [aulasFiltradas]);

  const faturamentoPorData = useMemo(() => {
    const map = new Map<string, number>();
    aulasFiltradas.forEach(a => map.set(a.date, (map.get(a.date) || 0) + a.price));
    return Array.from(map, ([date, faturamento]) => ({ date, faturamento })).sort(
      (a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime()
    );
  }, [aulasFiltradas]);

  const clientesAtivos = idsFiltrados.size;
  const totalAulas = aulasFiltradas.length;
  const tiposDisponiveis = useMemo(() => [...new Set(aulas.map(a => a.tipo))], [aulas]);

  return (
    <Container>
      <Topbar onToggleSidebar={() => setSidebarOpen(true)} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        tipoSelecionado={tipoSelecionado}
        onTipoChange={setTipoSelecionado}
        tiposDisponiveis={tiposDisponiveis}
        dataInicio={dataInicio}
        dataFim={dataFim}
        onDataChange={(i, f) => { setDataInicio(i); setDataFim(f); }}
      />

    
        <>
          <MetricsGrid>
            <Card title="Faturamento Total" value={`R$ ${faturamentoTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} />
            <Card title="NPS Médio" value={npsFiltrado.toFixed(2)} />
            <Card title="Clientes Ativos" value={clientesAtivos.toString()} />
            <Card title="Aulas Vendidas" value={totalAulas.toString()} />
          </MetricsGrid>

          <ChartsGrid>
            <ChartWrapper>
              <h2>Faturamento por Tipo</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={faturamentoPorTipo}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tipo" />
                  <YAxis />
                  <Tooltip formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} />
                  <Bar dataKey="faturamento" radius={[8,8,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>

            <ChartWrapper>
              <h2>Evolução no Tempo</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={faturamentoPorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} />
                  <Line type="monotone" dataKey="faturamento" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </ChartsGrid>
        </>
    </Container>
  );
};

export default Homepage;
