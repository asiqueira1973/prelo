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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[2/3] rounded-lg bg-fill" />
            <div className="mt-3 h-4 bg-fill rounded w-3/4" />
            <div className="mt-2 h-3 bg-fill rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 text-center text-ink-2 text-sm">
        Não foi possível carregar os lançamentos. Tente novamente.
      </div>
    );
  }

  if (livros.length === 0) {
    return (
      <div className="py-24 text-center text-ink-3 text-sm">
        Nenhum lançamento encontrado para este período.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
      {livros.map((livro) => (
        <BookCard key={livro.id} livro={livro} onClick={onSelect} />
      ))}
    </div>
  );
}
