import { useState, useEffect, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { supabase, monthRangeFilter } from '../lib/supabase';
import type { Livro } from '../lib/supabase';
import PublisherFilter from '../components/PublisherFilter';
import BookGrid from '../components/BookGrid';
import BookPanel from '../components/BookPanel';
import NewsletterSection from '../components/NewsletterSection';

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

  useEffect(() => {
    async function loadOptions() {
      const { data } = await supabase
        .from('livros_livros')
        .select('data_lancamento')
        .order('data_lancamento', { ascending: false });

      if (data && data.length > 0) {
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
        setSelected(opts[0]);
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

      if (err) {
        setError(true);
      } else {
        setLivros((data as Livro[]) ?? []);
      }
      setLoading(false);
    }
    load();
  }, [selected]);

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

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const opt = options.find((o) => o.value === e.target.value) ?? null;
    setSelected(opt);
  };

  if (loadingOptions) {
    return (
      <main className="flex-1">
        <div className="max-w-screen-xl mx-auto px-6 py-12">
          <div className="animate-pulse h-8 w-48 bg-stone-200 rounded mb-8" />
          <div className="animate-pulse h-12 w-64 bg-stone-200 rounded mb-8" />
        </div>
      </main>
    );
  }

  if (options.length === 0) {
    return (
      <main className="flex-1">
        <div className="max-w-screen-xl mx-auto px-6 py-24 text-center text-stone-400 text-sm">
          Nenhum período disponível.
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="flex-1">
        <div className="max-w-screen-xl mx-auto px-6 py-6 md:py-12">
          <div className="mb-6 md:mb-8 flex flex-col gap-2">
            <label htmlFor="month-select" className="text-xs font-medium text-stone-400 uppercase tracking-widest">
              Selecionar período
            </label>
            <div className="relative inline-block">
              <select
                id="month-select"
                value={selected?.value ?? ''}
                onChange={handleMonthChange}
                className="appearance-none bg-white border border-stone-300 text-charcoal text-sm rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-coral cursor-pointer"
              >
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            </div>
          </div>

          {selected && (
            <h1 className="font-serif text-xl md:text-2xl lg:text-3xl text-charcoal mb-6 md:mb-8 leading-tight">
              Lançamentos de {selected.label}
            </h1>
          )}

          <div className="mb-6 md:mb-8">
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
