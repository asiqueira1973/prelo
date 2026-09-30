import { useState } from 'react';

type View = 'home' | 'livrarias' | 'sobre';

type NavbarProps = {
  currentView: View;
  onNavigate: (view: View) => void;
};

export default function Navbar({ currentView, onNavigate }: NavbarProps) {
  const [open, setOpen] = useState(false);

  const navItems: { view: View; label: string }[] = [
    { view: 'livrarias', label: 'Livrarias em São Paulo' },
    { view: 'sobre', label: 'Sobre' },
  ];

  const handleNavigate = (view: View) => {
    onNavigate(view);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl backdrop-saturate-150 border-b border-line/60">
      <div className="max-w-screen-xl mx-auto px-6 h-12 flex items-center justify-between">
        <button
          onClick={() => handleNavigate('home')}
          className="text-lg font-semibold text-ink tracking-tight hover:opacity-70 transition-opacity"
        >
          Prelo
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navItems.map(({ view, label }) => (
            <button
              key={view}
              onClick={() => handleNavigate(view)}
              className={`text-xs transition-colors ${
                currentView === view ? 'text-ink' : 'text-ink-2 hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8 focus:outline-none"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          <span className={`block h-0.5 w-5 bg-ink transition-transform duration-200 ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`block h-0.5 w-5 bg-ink transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-5 bg-ink transition-transform duration-200 ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="md:hidden border-t border-line/60 bg-white px-6 py-2 flex flex-col gap-0">
          {navItems.map(({ view, label }) => (
            <button
              key={view}
              onClick={() => handleNavigate(view)}
              className={`text-base py-3 text-left transition-colors border-b border-line/60 last:border-0 ${
                currentView === view ? 'text-ink font-medium' : 'text-ink-2'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
