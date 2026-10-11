import { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { supabase, monthRangeFilter } from '../lib/supabase';
import type { Livro } from '../lib/supabase';
import PublisherFilter from '../components/PublisherFilter';
import BookGrid from '../components/BookGrid';
import BookPanel from '../components/BookPanel';
import NewsletterSection from '../components/NewsletterSection';
import { useWebMcpTools } from '../lib/webmcp';
import CountUp from '../components/CountUp';

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

type MonthOption = { month: number; year: number; label: string; value: string };

function dateStrToOption(dateStr: string): MonthOption {
  const [yearStr, monthStr] = dateStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  return {
    year,
    month,
    label: `${MONTH_NAMES[month - 1]} ${year}`,
    value: `${year}-${String(month).padStart(2, '0')}`,
  };
}

export default function AnteriorPage() {
  const [options, setOptions] = useState<MonthOption[]>([]);
  const [selected, setSelected] = useState<MonthOption | null>(null);
  const [livros, setLivros] = useState<Livro[]>([]);
  const [selectedEditoras, setSelectedEditoras] = useState<string[]>([]);
  const [selectedLivro, setSelectedLivro] = useState<Livro | null>(null);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  // Quem pediu a troca de mês pelo WebMCP espera o carregamento terminar.
  const pendingLoads = useRef(new Map<string, ((livros: Livro[] | null) => void)[]>());
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  // Quantos livros entraram em cada ano, para o "até agora em AAAA".
  const [porAno, setPorAno] = useState<Record<number, number>>({});

  useEffect(() => {
    async function loadOptions() {
      const { data } = await supabase
        .from('livros_livros')
        .select('data_lancamento')
        .order('data_lancamento', { ascending: false });

      if (data && data.length > 0) {
        const anos: Record<number, number> = {};
        for (const row of data) {
          const ano = parseInt(row.data_lancamento.slice(0, 4), 10);
          anos[ano] = (anos[ano] ?? 0) + 1;
        }
        setPorAno(anos);
        const seen = new Set<string>();
        const opts: MonthOption[] = [];
        for (const row of data) {
          const key = row.data_lancamento.slice(0, 7);
          if (!seen.has(key)) {
            seen.add(key);
            opts.push(dateStrToOption(row.data_lancamento));
          }
        }
        setOptions(opts);
        // Abre no mês atual; meses futuros (pré-venda) ficam no seletor.
        const hoje = new Date();
        const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
        setSelected(opts.find((o) => o.value <= mesAtual) ?? opts[opts.length - 1]);
      }
      setLoadingOptions(false);
    }
    loadOptions();
  }, []);

  useEffect(() => {
    if (!selected) return;
    async function load() {
      setLoading(true);
      setError(false);
      setSelectedEditoras([]);
      const { from, to } = monthRangeFilter(selected!.year, selected!.month);
      const { data, error: err } = await supabase
        .from('livros_livros')
        .select('*')
        .gte('data_lancamento', from)
        .lt('data_lancamento', to)
        .order('coletado_em', { ascending: false });

      const result = err ? null : ((data as Livro[]) ?? []);
      if (result) setLivros(result);
      else setError(true);
      setLoading(false);
      setLoadedFor(selected!.value);
    }
    load();
  }, [selected]);

  // Resolve depois do render, para a próxima ferramenta já ver o mês novo.
  useEffect(() => {
    if (!loadedFor) return;
    const waiting = pendingLoads.current.get(loadedFor);
    if (!waiting) return;
    pendingLoads.current.delete(loadedFor);
    waiting.forEach((resolve) => resolve(error ? null : livros));
  }, [loadedFor, livros, error]);

  const editoras = useMemo(
    () => [...new Set(livros.map((l) => l.editora))].sort(),
    [livros]
  );

  const filtered = useMemo(() => {
    if (selectedEditoras.length === 0) return livros;
    return livros.filter((l) => selectedEditoras.includes(l.editora));
  }, [livros, selectedEditoras]);

  const toggleEditora = (editora: string) => {
    setSelectedEditoras((prev) =>
      prev.includes(editora) ? prev.filter((e) => e !== editora) : [...prev, editora]
    );
  };

  const resumo = (l: Livro) => ({ id: l.id, titulo: l.titulo, autor: l.autor, editora: l.editora, data_lancamento: l.data_lancamento });

  useWebMcpTools([
    {
      name: 'listar_periodos',
      description: 'Lista os meses que têm lançamentos no Prelo (formato YYYY-MM) e qual está selecionado na tela.',
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: true },
      execute: () => ({
        selecionado: selected?.value ?? null,
        periodos: options.map((o) => ({ ano_mes: o.value, nome: o.label })),
      }),
    },
    {
      name: 'selecionar_periodo',
      description: 'Troca o mês exibido na tela e devolve os lançamentos daquele mês. Use listar_periodos para ver os meses disponíveis.',
      inputSchema: {
        type: 'object',
        properties: { ano_mes: { type: 'string', description: 'Mês no formato YYYY-MM, ex: 2026-09' } },
        required: ['ano_mes'],
      },
      execute: async ({ ano_mes }) => {
        const opt = options.find((o) => o.value === ano_mes);
        if (!opt) {
          return `Não há lançamentos em ${String(ano_mes)}. Meses disponíveis: ${options.map((o) => o.value).join(', ')}`;
        }
        const loaded = new Promise<Livro[] | null>((resolve) => {
          const list = pendingLoads.current.get(opt.value) ?? [];
          pendingLoads.current.set(opt.value, [...list, resolve]);
        });
        setSelectedLivro(null);
        setSelected(opt);
        const result = opt.value === loadedFor ? livros : await loaded;
        if (!result) return 'Não foi possível carregar os lançamentos.';
        return { periodo: opt.label, total: result.length, livros: result.map(resumo) };
      },
    },
    {
      name: 'filtrar_editoras',
      description: 'Filtra na tela os lançamentos do mês atual por uma ou mais editoras (busca parcial, sem diferenciar maiúsculas). Lista vazia remove o filtro.',
      inputSchema: {
        type: 'object',
        properties: { editoras: { type: 'array', items: { type: 'string' }, description: 'Nomes das editoras, ex: ["Todavia", "Fósforo"]' } },
        required: ['editoras'],
      },
      execute: ({ editoras: pedidas }) => {
        const termos = ((pedidas as string[]) ?? []).map((e) => e.toLowerCase());
        const match = editoras.filter((e) => termos.some((t) => e.toLowerCase().includes(t)));
        if (termos.length > 0 && match.length === 0) {
          return `Nenhuma editora encontrada. Editoras deste mês: ${editoras.join(', ')}`;
        }
        setSelectedEditoras(match);
        const visiveis = match.length === 0 ? livros : livros.filter((l) => match.includes(l.editora));
        return { editoras_selecionadas: match, total: visiveis.length, livros: visiveis.map(resumo) };
      },
    },
    {
      name: 'listar_lancamentos',
      description: 'Devolve os lançamentos visíveis na tela agora (mês e filtros atuais) e as editoras disponíveis no mês.',
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: true },
      execute: () => ({
        periodo: selected?.label ?? null,
        editoras_disponiveis: editoras,
        editoras_selecionadas: selectedEditoras,
        total: filtered.length,
        livros: filtered.map(resumo),
      }),
    },
    {
      name: 'abrir_livro',
      description: 'Abre na tela o painel de detalhes de um livro do mês atual, com capa e link para o site da editora. Aceita o id ou parte do título.',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'id do livro (de listar_lancamentos)' },
          titulo: { type: 'string', description: 'Título ou parte dele' },
        },
      },
      execute: ({ id, titulo }) => {
        const t = typeof titulo === 'string' ? titulo.toLowerCase() : null;
        const livro = livros.find((l) => l.id === id) ?? (t ? livros.find((l) => l.titulo.toLowerCase().includes(t)) : undefined);
        if (!livro) return 'Livro não encontrado no mês atual. Use selecionar_periodo ou listar_lancamentos.';
        setSelectedLivro(livro);
        return { ...resumo(livro), link_editora: livro.link_livro };
      },
    },
  ]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const opt = options.find((o) => o.value === e.target.value) ?? null;
    setSelected(opt);
  };

  if (loadingOptions) {
    return (
      <main className="flex-1">
        <div className="max-w-screen-xl mx-auto px-6 py-12">
          <div className="animate-pulse h-10 w-72 bg-fill rounded-lg mb-8" />
          <div className="animate-pulse h-9 w-96 bg-fill rounded-full mb-8" />
        </div>
      </main>
    );
  }

  if (options.length === 0) {
    return (
      <main className="flex-1">
        <div className="max-w-screen-xl mx-auto px-6 py-24 text-center text-ink-3 text-sm">
          Nenhum período disponível.
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="flex-1">
        <div className="max-w-screen-xl mx-auto px-6 pb-16 md:pb-24">
          <header className="pt-10 md:pt-20 pb-8 md:pb-12">
            <p className="text-sm md:text-base font-semibold text-ink-2 mb-2">Lançamentos literários</p>
            {selected && (
              <h1 className="text-4xl md:text-6xl font-semibold text-ink tracking-tightest leading-[1.05]">
                {selected.label}
              </h1>
            )}
            <p className="mt-3 md:mt-4 text-lg md:text-2xl text-ink-2 tracking-tight min-h-[1.5em]">
              {!loading && livros.length > 0 && selected && (
                <>
                  <CountUp value={livros.length} /> livros de {editoras.length}{' '}
                  {editoras.length === 1 ? 'editora' : 'editoras'}.{' '}
                  <span className="text-ink-3">
                    <CountUp value={porAno[selected.year] ?? 0} duration={1400} /> em {selected.year}{selected.year === new Date().getFullYear() ? ' até agora' : ''}.
                  </span>
                </>
              )}
            </p>
          </header>

          <div className="mb-8 md:mb-12 flex flex-wrap items-center gap-2">
            <label htmlFor="month-select" className="sr-only">
              Selecionar período
            </label>
            <div className="relative">
              <select
                id="month-select"
                value={selected?.value ?? ''}
                onChange={handleMonthChange}
                className="appearance-none bg-white border border-line text-ink text-sm rounded-full pl-4 pr-9 py-2 min-h-[36px] focus:outline-none focus:ring-4 focus:ring-accent/20 focus:border-accent cursor-pointer"
              >
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-2 pointer-events-none" />
            </div>
            {editoras.length > 0 && <span className="hidden sm:block w-px h-5 bg-line mx-2" aria-hidden />}
            <PublisherFilter
              editoras={editoras}
              selected={selectedEditoras}
              onToggle={toggleEditora}
            />
          </div>

          <BookGrid livros={filtered} loading={loading} error={error} onSelect={setSelectedLivro} />
        </div>
      </main>

      <NewsletterSection />

      <BookPanel livro={selectedLivro} onClose={() => setSelectedLivro(null)} />
    </>
  );
}
