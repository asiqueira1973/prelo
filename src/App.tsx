import { useState } from 'react';
import Navbar from './components/Navbar';
import AnteriorPage from './pages/AnteriorPage';
import LivrariasPage from './pages/LivrariasPage';
import SobrePage from './pages/SobrePage';

type View = 'home' | 'livrarias' | 'sobre';

export default function App() {
  const [view, setView] = useState<View>('home');

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar currentView={view} onNavigate={setView} />
      {view === 'home' && <AnteriorPage />}
      {view === 'livrarias' && <LivrariasPage />}
      {view === 'sobre' && <SobrePage />}
      <footer className="bg-cream border-t border-stone-200 py-6">
        <div className="max-w-screen-xl mx-auto px-6 text-center text-xs text-stone-400">
          © {new Date().getFullYear()} Prelo · Lançamentos literários brasileiros
        </div>
      </footer>
    </div>
  );
}
