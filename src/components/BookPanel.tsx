import { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import type { Livro } from '../lib/supabase';

type BookPanelProps = {
  livro: Livro | null;
  onClose: () => void;
};

const INVALID_PATTERNS = ['init.gif', 'placeholder', 'default'];

function isValidCover(url: string | null | undefined): boolean {
  if (!url) return false;
  return !INVALID_PATTERNS.some((p) => url.includes(p));
}

export default function BookPanel({ livro, onClose }: BookPanelProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [livro]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (livro) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [livro, onClose]);

  useEffect(() => {
    document.body.style.overflow = livro ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [livro]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-charcoal/40 z-40 transition-opacity duration-300 ${livro ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-cream z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${livro ? 'translate-x-0' : 'translate-x-full'}`}
        aria-modal="true"
        role="dialog"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200">
          <span className="text-xs font-medium text-stone-400 uppercase tracking-widest">Detalhes</span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-charcoal hover:bg-stone-100 transition-colors"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {livro && (
          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
            <div className="aspect-[2/3] w-full max-w-[240px] mx-auto rounded-xl overflow-hidden shadow-lg bg-[#E8E0D0] flex items-center justify-center">
              {isValidCover(livro.link_capa) && !imgError ? (
                <img
                  key={livro.link_capa}
                  src={livro.link_capa!}
                  alt={livro.titulo}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <p className="font-serif text-sm text-stone-500 text-center px-4 leading-snug">
                  {livro.titulo}
                </p>
              )}
            </div>

            <div className="text-center space-y-2">
              <h2 className="font-serif text-2xl text-charcoal leading-tight">{livro.titulo}</h2>
              {livro.autor && (
                <p className="text-sm text-stone-500">{livro.autor}</p>
              )}
              <p className="text-sm text-stone-400">{livro.editora}</p>
            </div>

            {livro.link_livro && (
              <a
                href={livro.link_livro}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto flex items-center justify-center gap-2 bg-coral hover:bg-coral/90 text-white rounded-xl px-6 py-4 font-medium text-sm transition-colors duration-150"
              >
                Ver no site da editora
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
