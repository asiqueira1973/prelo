import { useEffect, useRef } from 'react';

// WebMCP (experimental, Chrome com a flag "WebMCP for testing"): a página
// registra ferramentas no modelContext para o agente do navegador.
// Em navegadores sem suporte, nada acontece.

type ToolResult = { content: { type: 'text'; text: string }[] };

export type WebMcpTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: { readOnlyHint?: boolean };
  execute: (input: Record<string, unknown>) => Promise<unknown> | unknown;
};

type ModelContext = {
  registerTool: (
    tool: {
      name: string;
      description: string;
      inputSchema: Record<string, unknown>;
      annotations?: { readOnlyHint?: boolean };
      execute: (input: Record<string, unknown>) => Promise<ToolResult>;
    },
    options?: { signal?: AbortSignal }
  ) => unknown;
  unregisterTool?: (name: string) => void;
};

// O Chrome 154 expõe a API em document.modelContext; versões anteriores da
// proposta usavam navigator.modelContext.
function modelContext(): ModelContext | null {
  const mc =
    (navigator as Navigator & { modelContext?: ModelContext }).modelContext ??
    (document as Document & { modelContext?: ModelContext }).modelContext;
  return mc && typeof mc.registerTool === 'function' ? mc : null;
}

function asResult(value: unknown): ToolResult {
  const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  return { content: [{ type: 'text', text }] };
}

// Registra as ferramentas enquanto o componente estiver montado. As funções
// execute são lidas por ref, então podem usar o estado mais recente sem
// re-registrar a cada render.
export function useWebMcpTools(tools: WebMcpTool[]) {
  const toolsRef = useRef(tools);
  toolsRef.current = tools;
  const names = tools.map((t) => t.name).join(',');

  useEffect(() => {
    const mc = modelContext();
    if (!mc) return;

    // O abort do signal desregistra as ferramentas (Chrome 154); unregisterTool
    // cobre as versões que ainda usam remoção por nome.
    const controller = new AbortController();
    const registered = toolsRef.current.map((t) => t.name);

    for (const tool of toolsRef.current) {
      try {
        const ret = mc.registerTool(
          {
            name: tool.name,
            description: tool.description,
            inputSchema: tool.inputSchema,
            annotations: tool.annotations,
            execute: async (input) => {
              const current = toolsRef.current.find((t) => t.name === tool.name);
              try {
                return asResult(await current!.execute(input ?? {}));
              } catch (e) {
                return asResult(`Erro: ${e instanceof Error ? e.message : String(e)}`);
              }
            },
          },
          { signal: controller.signal }
        );
        if (ret instanceof Promise) {
          ret.catch((e) => console.warn(`[webmcp] falha ao registrar ${tool.name}`, e));
        }
      } catch (e) {
        console.warn(`[webmcp] falha ao registrar ${tool.name}`, e);
      }
    }

    return () => {
      controller.abort();
      if (mc.unregisterTool) {
        for (const name of registered) {
          try {
            mc.unregisterTool(name);
          } catch {
            // já removida
          }
        }
      }
    };
  }, [names]);
}
