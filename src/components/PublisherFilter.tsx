type PublisherFilterProps = {
  editoras: string[];
  selected: string[];
  onToggle: (editora: string) => void;
};

export default function PublisherFilter({ editoras, selected, onToggle }: PublisherFilterProps) {
  if (editoras.length === 0) return null;

  return (
    <>
      {editoras.map((editora) => {
        const active = selected.includes(editora);
        return (
          <button
            key={editora}
            onClick={() => onToggle(editora)}
            className={`px-4 py-2 rounded-full text-sm transition-colors duration-150 min-h-[36px] ${
              active
                ? 'bg-ink text-white'
                : 'bg-fill text-ink hover:bg-[#E8E8ED]'
            }`}
          >
            {editora}
          </button>
        );
      })}
    </>
  );
}
