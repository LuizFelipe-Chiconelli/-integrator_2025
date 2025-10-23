"use client";

import { useEffect, useMemo, useState } from "react";
import { Container } from "react-bootstrap";

import ApplicationTable from "@/components/user/applications/table";
import PaginationButtons from "@/components/all/pagination";

import Select from "@/components/all/select";
import TextInput from "@/components/all/textinput";
import api from "@/services/api";

import ManageUserApplicationModal from "@/components/sections/(user)/applications/manage-application-modal";
import type { CandidaturaItem } from "@/components/user/applications/row";

type ApiResp = { status: number; data: CandidaturaItem[] };

export default function ApplicationsGrid() {
  const [texto, setTexto] = useState("");
  const [status, setStatus] = useState<string>("all");

  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [totalPages, setTotalPages] = useState(1);

  const [items, setItems] = useState<CandidaturaItem[]>([]);
  const [loading, setLoading] = useState(true);

  // modal
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<CandidaturaItem | null>(null);

  const reload = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<ApiResp>("/candidatura/minhas");
      setItems(data?.data || []);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  // filtro client-side
  const filtered = useMemo(() => {
    const t = texto.trim().toLowerCase();
    return items.filter((it) => {
      const okText =
        !t ||
        [it.titulo || "", it.empresa || ""].join(" ").toLowerCase().includes(t);
      const okStatus = status === "all" || String(it.statusCandidatura) === status;
      return okText && okStatus;
    });
  }, [items, texto, status]);

  // quando mudar filtros, volta página p/ 1
  useEffect(() => setPage(1), [texto, status]);

  // paginação client-side
  const total = filtered.length;
  const tp = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const slice = filtered.slice(start, start + pageSize);

  useEffect(() => setTotalPages(tp), [tp]);

  // abrir modal
  const handleView = (vaga_id: number, curriculum_id: number) => {
    const found =
      items.find((x) => x.vaga_id === vaga_id && x.curriculum_id === curriculum_id) || null;
    setCurrent(found);
    setOpen(true);
  };

  return (
    <Container fluid className="p-0 mt-4">
      <div className="row row-cols-1 row-cols-md-2 g-3 mb-3">
        <TextInput
          controlId="filtroTexto"
          label="Filtrar por texto"
          placeholder="Pesquisar por vaga / empresa"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <Select
          controlId="filtroStatus"
          label="Filtrar por Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { id: "all", displayName: "Todos" },
            { id: "11", displayName: "Pendente" },
            { id: "12", displayName: "Em análise" },
            { id: "13", displayName: "Aprovado" },
            { id: "14", displayName: "Reprovado" },
          ]}
        />
      </div>

      <Container fluid className="border rounded-2 m-0 p-1">
        <ApplicationTable
          view="user"              // <<<<< aqui estava "Company"
          items={slice}
          loading={loading}
          onView={handleView}
        />
      </Container>

      <PaginationButtons
        className="mt-3"
        active={page}
        total={totalPages}
        onChange={setPage}
      />

      <ManageUserApplicationModal
        open={open}
        vagaId={current?.vaga_id ?? null}
        prefill={
          current
            ? {
                titulo: current.titulo,
                empresa: current.empresa,
                dataCandidatura: current.dataCandidatura,
                statusCandidatura: current.statusCandidatura,
              }
            : null
        }
        onClose={() => setOpen(false)}
        onSaved={reload}
      />
    </Container>
  );
}
