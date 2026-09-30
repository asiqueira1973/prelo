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
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${livro ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${livro ? 'translate-x-0' : 'translate-x-full'}`}
        aria-modal="true"
        role="dialog"
      >
        <div className="flex items-center justify-between px-6 py-4">
          <span className="text-sm font-semibold text-ink">Detalhes</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-fill text-ink-2 hover:text-ink hover:bg-[#E8E8ED] transition-colors"
            aria-label="Fechar"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {livro && (
          <div className="flex-1 overflow-y-auto px-8 pb-8 pt-4 flex flex-col gap-6">
            <div className="aspect-[2/3] w-full max-w-[220px] mx-auto rounded-lg overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.18)] bg-fill flex items-center justify-center">
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
                <p className="text-sm font-medium text-ink-3 text-center px-4 leading-snug">
                  {livro.titulo}
                </p>
              )}
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-2xl font-semibold text-ink tracking-tight leading-tight">{livro.titulo}</h2>
              {livro.autor && (
                <p className="text-base text-ink-2">{livro.autor}</p>
              )}
              <p className="text-sm text-ink-3">{livro.editora}</p>
            </div>

            {livro.link_livro && (
              <a
                href={livro.link_livro}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white rounded-full px-6 py-3.5 text-base transition-colors duration-150"
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
