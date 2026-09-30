import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Livraria } from '../lib/supabase';
import { useWebMcpTools } from '../lib/webmcp';

export default function LivrariasPage() {
  const [livrarias, setLivrarias] = useState<Livraria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      const { data, error: err } = await supabase
        .from('livros_livrarias')
        .select('*')
        .eq('ativa', true)
        .order('nome', { ascending: true });

      if (err) {
        setError(true);
      } else {
        setLivrarias((data as Livraria[]) ?? []);
      }
      setLoading(false);
    }
    load();
  }, []);

  useWebMcpTools([
    {
      name: 'listar_livrarias',
      description: 'Lista as livrarias independentes de São Paulo exibidas na página, com endereço e Instagram.',
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: true },
      execute: () =>
        loading
          ? 'A lista ainda está carregando, tente de novo em instantes.'
          : livrarias.map(({ nome, endereco, instagram }) => ({ nome, endereco, instagram })),
    },
  ]);

  return (
    <main className="flex-1">
      <div className="max-w-screen-lg mx-auto px-6 py-6 md:py-12 pb-16 md:pb-24">
        <h1 className="text-4xl md:text-6xl font-semibold text-ink tracking-tightest leading-[1.05] pt-4 md:pt-8 mb-10 md:mb-14">
          Livrarias em São Paulo
        </h1>

        {loading && (
          <ul className="space-y-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="animate-pulse space-y-2">
                <div className="h-5 w-48 bg-fill rounded" />
                <div className="h-4 w-72 bg-fill rounded" />
                <div className="h-4 w-32 bg-fill rounded" />
              </li>
            ))}
          </ul>
        )}

        {error && (
          <p className="text-sm text-ink-3">Não foi possível carregar as livrarias.</p>
        )}

        {!loading && !error && livrarias.length === 0 && (
          <p className="text-sm text-ink-3">Nenhuma livraria encontrada.</p>
        )}

        {!loading && !error && livrarias.length > 0 && (
          <ul className="grid sm:grid-cols-2 gap-x-12 border-t border-line/60">
            {livrarias.map((l) => {
              const handle = l.instagram ? l.instagram.replace(/^@/, '') : null;
              return (
                <li key={l.id} className="py-6 border-b border-line/60">
                  <p className="font-semibold text-ink text-lg tracking-tight leading-snug">
                    {l.nome}
                  </p>
                  {l.endereco && (
                    <p className="mt-1 text-sm text-ink-2">{l.endereco}</p>
                  )}
                  {handle && (
                    <a
                      href={`https://www.instagram.com/${handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-sm text-accent hover:underline"
                    >
                      {handle}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
