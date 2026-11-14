# Prelo

Catálogo de lançamentos literários brasileiros, organizado por mês e por editora.

**Site:** [prelo.art.br](https://prelo.art.br)

![Página de lançamentos do mês no Prelo](public/og.jpg)

## Principais funcionalidades

- Lançamentos do mês, com seletor de período (inclusive pré-venda) e filtro por editora.
- Painel de detalhes de cada livro, com capa e link para a página da editora.
- Contador de livros do mês e total do ano.
- Mapa de livrarias independentes em São Paulo (Leaflet + OpenStreetMap).
- Inscrição na newsletter mensal.
- **Acesso para agentes de IA:**
  - [Prelo MCP](https://github.com/asiqueira1973/prelo-mcp) — servidor MCP público, sem autenticação, com a ferramenta `buscar_livros`. O código está no repositório [`prelo-mcp`](https://github.com/asiqueira1973/prelo-mcp).
  - **WebMCP:** em navegadores com suporte, a própria página registra ferramentas para listar períodos, trocar o mês, filtrar por editora, abrir um livro e navegar entre as páginas ([`src/lib/webmcp.ts`](src/lib/webmcp.ts)).
  - [`public/llms.txt`](public/llms.txt) descrevendo o site e as formas de acesso para agentes.

Os dados vêm de uma base Supabase alimentada por uma coleta semanal nos sites das editoras. O coletor não faz parte deste repositório.

## Stack técnica

- React 18, TypeScript, Vite.
- Tailwind CSS.
- Supabase (leitura dos livros e livrarias pelo cliente `supabase-js`).
- Leaflet com tiles do OpenStreetMap para o mapa.
- Buttondown para a newsletter.

## Como foi construído

O Prelo foi desenvolvido com Claude (Anthropic). Este repositório contém só o site: a especificação, o coletor de dados e testes automatizados não estão aqui. As verificações disponíveis no projeto são lint (ESLint) e checagem de tipos (`tsc`).

## Status

Publicado — no ar em [prelo.art.br](https://prelo.art.br).

## Rodar localmente

```bash
npm install
npm run dev         # servidor de desenvolvimento do Vite
npm run lint
npm run typecheck
npm run build
```

## Licença

O código está disponível apenas para leitura e estudo. Veja [LICENSE](LICENSE).

## Contribuições

Issues são bem-vindas; pull requests não são aceitos. Veja [CONTRIBUTING.md](CONTRIBUTING.md).

---

Feito pela [Dab Lab](https://www.dablab.com.br/) — agência de inovação no-code para startups e PMEs, com automações usando IA.
