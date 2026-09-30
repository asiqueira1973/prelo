import BookCard from './BookCard';
import type { Livro } from '../lib/supabase';

type BookGridProps = {
  livros: Livro[];
  loading: boolean;
  error: boolean;
  onSelect: (livro: Livro) => void;
};

export default function BookGrid({ livros, loading, error, onSelect }: BookGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[2/3] rounded-xl bg-stone-200" />
            <div className="mt-3 h-4 bg-stone-200 rounded w-3/4" />
            <div className="mt-2 h-3 bg-stone-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 text-center text-stone-500 text-sm">
        Não foi possível carregar os lançamentos. Tente novamente.
      </div>
    );
  }

  if (livros.length === 0) {
    return (
      <div className="py-24 text-center text-stone-400 text-sm">
        Nenhum lançamento encontrado para este período.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
      {livros.map((livro) => (
        <BookCard key={livro.id} livro={livro} onClick={onSelect} />
      ))}
    </div>
  );
}
