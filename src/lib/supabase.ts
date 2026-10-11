import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jeesdmfcrmhyufwzwzwt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZXNkbWZjcm1oeXVmd3p3end0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3OTI5NTgsImV4cCI6MjA5MzM2ODk1OH0.fmNbRvZqyhBD09dXVjLbg9IJRrDgDKxq5hTCh5pR3wA';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Livro = {
  id: string;
  titulo: string;
  autor: string | null;
  editora: string;
  data_lancamento: string;
  link_livro: string | null;
  link_capa: string | null;
  coletado_em: string;
};

export type Livraria = {
  id: string;
  nome: string;
  endereco: string | null;
  instagram: string | null;
  ativa: boolean;
  lat: number | null;
  lng: number | null;
};

export function monthRangeFilter(year: number, month: number) {
  const from = new Date(Date.UTC(year, month - 1, 1)).toISOString().slice(0, 10);
  const to = new Date(Date.UTC(year, month, 1)).toISOString().slice(0, 10);
  return { from, to };
}

export function utcToday(): { year: number; month: number } {
  const now = new Date();
  return { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 };
}
