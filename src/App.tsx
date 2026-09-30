import { useState } from 'react';
import Navbar from './components/Navbar';
import AnteriorPage from './pages/AnteriorPage';
import LivrariasPage from './pages/LivrariasPage';
import SobrePage from './pages/SobrePage';
import { useWebMcpTools } from './lib/webmcp';

type View = 'home' | 'livrarias' | 'sobre';

export default function App() {
  const [view, setView] = useState<View>('home');

  useWebMcpTools([
    {
      name: 'navegar',
      description: 'Muda a página do Prelo: "lancamentos" (lançamentos do mês, com filtros), "livrarias" (livrarias independentes em São Paulo) ou "sobre". As ferramentas disponíveis mudam conforme a página.',
      inputSchema: {
        type: 'object',
        properties: { pagina: { type: 'string', enum: ['lancamentos', 'livrarias', 'sobre'] } },
        required: ['pagina'],
      },
      execute: ({ pagina }) => {
        const next: View = pagina === 'livrarias' ? 'livrarias' : pagina === 'sobre' ? 'sobre' : 'home';
        setView(next);
        window.scrollTo({ top: 0 });
        return `Página atual: ${String(pagina)}`;
      },
    },
  ]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar currentView={view} onNavigate={(v) => { setView(v); window.scrollTo({ top: 0 }); }} />
      {view === 'home' && <AnteriorPage />}
      {view === 'livrarias' && <LivrariasPage />}
      {view === 'sobre' && <SobrePage />}
      <footer className="bg-fill border-t border-line/60 py-5">
        <div className="max-w-screen-xl mx-auto px-6 text-xs text-ink-3">
          © {new Date().getFullYear()} Prelo · Lançamentos literários brasileiros
        </div>
      </footer>
    </div>
  );
}
