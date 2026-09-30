export default function SobrePage() {
  return (
    <main className="flex-1">
      <div className="max-w-2xl mx-auto px-6 py-16 sm:py-24">
        <h1 className="text-5xl sm:text-6xl font-semibold text-ink tracking-tightest mb-10 leading-[1.05]">Prelo</h1>

        <div className="space-y-5 text-lg md:text-xl text-ink-2 leading-relaxed tracking-tight">
          <p>
            Prelo é um agregador de lançamentos literários brasileiros.
          </p>
          <p>
            Todo mês, reunimos aqui os novos títulos das editoras que mais respeitamos — aquelas comprometidas com literatura de qualidade, autores nacionais e traduções cuidadosas de vozes de todo o mundo.
          </p>
          <p>
            Não somos uma livraria. Não vendemos livros. Não temos algoritmo de recomendação.
          </p>
          <p>
            Somos um lugar simples para quem quer saber o que está saindo — sem precisar visitar o site de cada editora, sem depender do que o Instagram decide mostrar.
          </p>
        </div>

        <div className="mt-14 space-y-4">
          <h2 className="text-2xl font-semibold text-ink tracking-tight">Feito por</h2>
          <p className="text-lg text-ink-2 leading-relaxed">
            Prelo é um projeto da{' '}
            <a
              href="https://www.dablab.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Dab Lab
            </a>
            {' '}— uma agência especializada em soluções digitais com tecnologias no-code, automação e inteligência artificial.
          </p>
        </div>
      </div>
    </main>
  );
}
