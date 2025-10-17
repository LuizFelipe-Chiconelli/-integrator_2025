"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import JobCard, { type JobCardProps } from "./card";

type VagaAPI = JobCardProps;

type Props = {
  searchText: string;
  status: "" | "0" | "11" | "12" | "13" | "14"; // "" ou "0" = todos
  page: number;
  pageSize?: number;
  onLoaded?: (meta: { total: number; totalPages: number }) => void;
  onManage?: (id: number) => void; // ← repassa para o card
  refreshToken?: number;           // ← para recarregar lista após salvar/excluir
};

export default function List({
  searchText,
  status,
  page,
  pageSize = 6,
  onLoaded,
  onManage,
  refreshToken,
}: Props) {
  const [rows, setRows] = useState<VagaAPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // pega todas as vagas da empresa
        const { data } = await api.get<{ status: number; data: VagaAPI[] }>("/vaga/minhas");
        const all = data?.data ?? [];

        // filtros no cliente
        const text = searchText.trim().toLowerCase();
        const hasText = text.length > 0;
        const statusNum = status && status !== "0" ? Number(status) : null;

        const filtered = all.filter((v) => {
          const okStatus = statusNum === null ? true : Number(v.statusVaga) === statusNum;
          if (!hasText) return okStatus;

          const haystack = [v.titulo, v.cargo_descricao, v.localizacao, v.requisitos]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return okStatus && haystack.includes(text);
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
    // inclui refreshToken para forçar reload pós-salvar/excluir
  }, [searchText, status, page, pageSize, onLoaded, refreshToken]);

  if (loading) return <div className="text-muted">Carregando...</div>;
  if (!rows.length) return <div className="text-muted">Nenhuma vaga encontrada.</div>;

  return (
    <div className="w-100 d-flex flex-column gap-3">
      {rows.map((v) => (
        <JobCard key={v.vaga_id} {...v} onManage={onManage} />
      ))}
    </div>
  );
}
