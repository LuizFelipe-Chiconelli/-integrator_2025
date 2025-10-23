"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import JobCard, { type UserJobCardProps } from "./card";

type VagaAPI = UserJobCardProps & {
  statusVaga?: number;
  sobreaVaga?: string | null;
};

type Props = {
  searchText: string;
  page: number;
  pageSize?: number;
  onLoaded?: (meta: { total: number; totalPages: number }) => void;
  onApply?: (vagaId: number) => void;
};

// helper genérico para GET
async function tryFetch<T = any>(url: string): Promise<T> {
  const { data } = await api.get(url);
  // backend padrão: { status, data }
  if (data && typeof data === "object" && "data" in data) {
    return data.data as T;
  }
  return data as T;
}

export default function List({
  searchText,
  page,
  pageSize = 6,
  onLoaded,
  onApply,
}: Props) {
  const [rows, setRows] = useState<VagaAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState<Record<number, number>>({}); // vaga_id -> status

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // 1) vagas públicas (tenta ambas URLs)
        let all: VagaAPI[] = await tryFetch("/vaga/listaPublica");
        if (!all?.length) {
          const alt = await tryFetch<VagaAPI[]>("/vaga/lista_publica");
          if (alt?.length) all = alt;
        }

        // 2) candidaturas do usuário para marcar botões
        try {
          const minhas = await tryFetch<Array<{ vaga_id: number; statusCandidatura: number }>>(
            "/candidatura/minhas"
          );
          const m: Record<number, number> = {};
          for (const c of (minhas || [])) m[c.vaga_id] = c.statusCandidatura;
          setApplied(m);
        } catch {
          setApplied({});
        }

        // 3) filtro + paginação (client-side)
        const text = searchText.trim().toLowerCase();
        const hasText = text.length > 0;

        const filtered = (all || []).filter((v) => {
          if (!hasText) return true;
          const haystack = [
            v.titulo,
            v.cargo_descricao,
            v.localizacao,
            v.requisitos,
            v.descricao || v.sobreaVaga,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          return haystack.includes(text);
        });

        const total = filtered.length;
        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        const start = (page - 1) * pageSize;
        const slice = filtered.slice(start, start + pageSize);

        setRows(slice);
        onLoaded?.({ total, totalPages });
      } catch (e) {
        console.error(e);
        setRows([]);
        onLoaded?.({ total: 0, totalPages: 1 });
      } finally {
        setLoading(false);
      }
    })();
  }, [searchText, page, pageSize, onLoaded]);

  if (loading) return <div className="text-muted">Carregando...</div>;
  if (!rows.length) return <div className="text-muted">Nenhuma vaga encontrada.</div>;

  return (
    <div className="w-100 d-flex flex-column gap-3">
      {rows.map((v) => (
        <JobCard
          key={v.vaga_id}
          vaga_id={v.vaga_id}
          titulo={v.titulo}
          cargo_descricao={v.cargo_descricao}
          descricao={v.descricao ?? v.sobreaVaga ?? ""}
          requisitos={v.requisitos}
          localizacao={v.localizacao}
          salario={v.salario}
          dtFim={v.dtFim}
          appliedStatus={applied[v.vaga_id]}
          onApply={onApply}
        />
      ))}
    </div>
  );
}
