type PublisherFilterProps = {
  editoras: string[];
  selected: string[];
  onToggle: (editora: string) => void;
};

export default function PublisherFilter({ editoras, selected, onToggle }: PublisherFilterProps) {
  if (editoras.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {editoras.map((editora) => {
        const active = selected.includes(editora);
        return (
          <button
            key={editora}
            onClick={() => onToggle(editora)}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium border transition-all duration-150 min-h-[36px] md:min-h-[44px] ${
              active
                ? 'bg-coral border-coral text-white'
                : 'bg-transparent border-charcoal text-charcoal hover:border-coral hover:text-coral'
            }`}
          >
            {editora}
          </button>
        );
      })}
    </div>
  );
}
