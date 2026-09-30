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
    <section className="bg-fill">
      <div className="max-w-screen-xl mx-auto px-6 py-20 md:py-24 flex flex-col items-center text-center gap-3">
        <h2 className="text-3xl md:text-4xl font-semibold text-ink tracking-tight leading-tight">
          Receba os lançamentos do mês
        </h2>
        <p className="text-ink-2 text-base md:text-lg max-w-md leading-relaxed">
          Uma vez por mês, os novos livros das melhores editoras brasileiras.
        </p>

        <form
          action="https://buttondown.com/api/emails/embed-subscribe/prelo"
          method="POST"
          target="popupwindow"
          className="w-full max-w-md flex flex-col sm:flex-row gap-3 mt-6"
        >
          <input
            id="newsletter-email"
            type="email"
            name="email"
            placeholder="seu@email.com"
            required
            className="flex-1 px-4 py-3 rounded-xl border border-line bg-white text-ink placeholder:text-ink-3 text-base focus:outline-none focus:ring-4 focus:ring-accent/20 focus:border-accent"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-full text-base text-white bg-accent hover:bg-accent-hover transition-colors duration-150 whitespace-nowrap"
          >
            Assinar
          </button>
        </form>

        <p className="text-xs text-ink-3 max-w-sm text-center leading-relaxed mt-2">
          Você receberá um email de confirmação. Verifique sua caixa de spam se não encontrá-lo.
        </p>
      </div>
    </section>
  );
}
