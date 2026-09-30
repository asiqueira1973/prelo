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
      className="group text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 rounded-xl"
    >
      <div className="relative overflow-hidden rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-200 aspect-[2/3] bg-[#E8E0D0]">
        <BookCover
          src={livro.link_capa}
          title={livro.titulo}
          className="transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-2 md:mt-3 px-0.5 md:px-1">
        <p className="text-sm text-charcoal font-medium leading-snug line-clamp-2">{livro.titulo}</p>
        <p className="text-xs text-stone-400 mt-1">{livro.editora}</p>
      </div>
    </button>
  );
}
