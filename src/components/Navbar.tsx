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
    <header className="sticky top-0 z-50 bg-cream border-b border-stone-200">
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => handleNavigate('home')}
          className="font-serif text-2xl text-charcoal tracking-tight hover:opacity-75 transition-opacity"
        >
          Prelo
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map(({ view, label }) => (
            <button
              key={view}
              onClick={() => handleNavigate(view)}
              className={`text-sm font-medium transition-colors ${
                currentView === view ? 'text-coral' : 'text-charcoal hover:text-coral'
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
          <span className={`block h-0.5 w-5 bg-charcoal transition-transform duration-200 ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`block h-0.5 w-5 bg-charcoal transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-5 bg-charcoal transition-transform duration-200 ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="md:hidden border-t border-stone-200 bg-cream px-6 py-3 flex flex-col gap-0">
          {navItems.map(({ view, label }) => (
            <button
              key={view}
              onClick={() => handleNavigate(view)}
              className={`text-sm font-medium py-3 text-left transition-colors border-b border-stone-100 last:border-0 ${
                currentView === view ? 'text-coral' : 'text-charcoal'
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
