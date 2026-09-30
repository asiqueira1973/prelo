import { useWebMcpTools } from '../lib/webmcp';

export default function NewsletterSection() {
  useWebMcpTools([
    {
      name: 'preencher_newsletter',
      description: 'Preenche o e-mail no formulário da newsletter mensal do Prelo e rola a tela até ele. Não envia: a pessoa confirma clicando em Assinar.',
      inputSchema: {
        type: 'object',
        properties: { email: { type: 'string', description: 'E-mail da pessoa' } },
        required: ['email'],
      },
      execute: ({ email }) => {
        const input = document.getElementById('newsletter-email') as HTMLInputElement | null;
        if (!input) return 'Formulário não encontrado.';
        input.value = String(email);
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        input.focus();
        return 'E-mail preenchido. Peça para a pessoa clicar em Assinar para confirmar.';
      },
    },
  ]);

  return (
    <section className="bg-stone-100 border-t border-stone-200">
      <div className="max-w-screen-xl mx-auto px-6 py-16 flex flex-col items-center text-center gap-4">
        <h2 className="font-serif text-xl sm:text-2xl text-charcoal leading-tight">
          Receba os lançamentos do mês
        </h2>
        <p className="text-stone-500 text-sm sm:text-base max-w-md leading-relaxed">
          Uma vez por mês, os novos livros das melhores editoras brasileiras.
        </p>

        <form
          action="https://buttondown.com/api/emails/embed-subscribe/prelo"
          method="POST"
          target="popupwindow"
          className="w-full max-w-sm flex flex-col sm:flex-row gap-3 mt-2"
        >
          <input
            id="newsletter-email"
            type="email"
            name="email"
            placeholder="seu@email.com"
            required
            className="flex-1 px-4 py-3 rounded-xl border border-stone-300 bg-white text-charcoal placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl text-sm font-medium text-white transition-opacity duration-150 hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: '#C96442' }}
          >
            Assinar
          </button>
        </form>

        <p className="text-xs text-stone-400 max-w-sm text-center leading-relaxed">
          Você receberá um email de confirmação. Verifique sua caixa de spam se não encontrá-lo.
        </p>
      </div>
    </section>
  );
}
