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
      <div className="max-w-screen-xl mx-auto px-6 py-6 md:py-12">
        <h1 className="font-serif text-xl md:text-2xl lg:text-3xl text-charcoal mb-6 md:mb-10 leading-tight">
          Livrarias em São Paulo
        </h1>

        {loading && (
          <ul className="space-y-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="animate-pulse space-y-2">
                <div className="h-5 w-48 bg-stone-200 rounded" />
                <div className="h-4 w-72 bg-stone-200 rounded" />
                <div className="h-4 w-32 bg-stone-200 rounded" />
              </li>
            ))}
          </ul>
        )}

        {error && (
          <p className="text-sm text-stone-400">Não foi possível carregar as livrarias.</p>
        )}

        {!loading && !error && livrarias.length === 0 && (
          <p className="text-sm text-stone-400">Nenhuma livraria encontrada.</p>
        )}

        {!loading && !error && livrarias.length > 0 && (
          <ul className="divide-y divide-stone-200">
            {livrarias.map((l) => {
              const handle = l.instagram ? l.instagram.replace(/^@/, '') : null;
              return (
                <li key={l.id} className="py-6 first:pt-0">
                  <p className="font-serif font-bold text-charcoal text-lg leading-snug">
                    {l.nome}
                  </p>
                  {l.endereco && (
                    <p className="mt-1 text-sm text-stone-600">{l.endereco}</p>
                  )}
                  {handle && (
                    <a
                      href={`https://www.instagram.com/${handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-sm text-coral hover:underline"
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
