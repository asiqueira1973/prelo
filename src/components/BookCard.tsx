import type { Livro } from '../lib/supabase';
import BookCover from './BookCover';

type BookCardProps = {
  livro: Livro;
  onClick: (livro: Livro) => void;
};

export default function BookCard({ livro, onClick }: BookCardProps) {
  return (
    <button
      onClick={() => onClick(livro)}
      className="group text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 rounded-lg"
    >
      <div className="relative overflow-hidden rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] group-hover:shadow-[0_12px_28px_rgba(0,0,0,0.16)] group-hover:-translate-y-1 transition-all duration-300 aspect-[2/3] bg-fill">
        <BookCover
          src={livro.link_capa}
          title={livro.titulo}
          className=""
        />
      </div>
      <div className="mt-3">
        <p className="text-sm text-ink font-semibold leading-snug line-clamp-2">{livro.titulo}</p>
        <p className="text-xs text-ink-2 mt-1">{livro.editora}</p>
      </div>
    </button>
  );
}
