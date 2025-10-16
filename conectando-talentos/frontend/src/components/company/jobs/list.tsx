"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import JobCard, { type JobCardProps } from "./card";

type VagaAPI = JobCardProps; // ← agora o import de JobCardProps é usado

type Props = {
  searchText: string;
  status: "" | "11" | "12" | "13" | "14";
  page: number;
  pageSize?: number;
  onLoaded?: (meta: { total: number; totalPages: number }) => void;
};

export default function List({
  searchText,
  status,
  page,
  pageSize = 6,
  onLoaded,
}: Props) {
  const [rows, setRows] = useState<VagaAPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get<{ status: number; data: VagaAPI[] }>(
          "/vaga/minhas",
          { params: status ? { status } : {} }
        );

        const all = data?.data ?? [];

        const text = searchText.trim().toLowerCase();
        const filtered = !text
          ? all
          : all.filter((v) => {
              const s = [
                v.titulo,
                v.cargo_descricao,
                v.localizacao,
                v.requisitos,
              ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
              return s.includes(text);
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
  }, [searchText, status, page, pageSize, onLoaded]);

  if (loading) return <div className="text-muted">Carregando...</div>;
  if (!rows.length) return <div className="text-muted">Nenhuma vaga encontrada.</div>;

  return (
    <div className="w-100 d-flex flex-column gap-3">
      {rows.map((v) => (
        <JobCard
          key={v.vaga_id}
          {...v}                           // ← passa todas as props do tipo JobCardProps
          onManage={(id) => console.log("gerenciar vaga", id)}
        />
      ))}
    </div>
  );
}
