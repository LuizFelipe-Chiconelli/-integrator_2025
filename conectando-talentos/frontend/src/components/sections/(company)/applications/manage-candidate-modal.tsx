"use client";

import { useEffect, useMemo, useState } from "react";
import { Container, Form, Button, Badge } from "react-bootstrap";
import api from "@/services/api";
import ApplicationTable from "@/components/user/applications/table";
import PaginationButtons from "@/components/all/pagination";

// ⚠️ AJUSTE o caminho abaixo para onde está seu modal:
import ManageCandidateModal from "@/components/sections/(company)/applications/manage-candidate-modal";
// Ex.: "@/components/sections/(company)/applications/manage-candidate-modal"

type VagaEmpresa = { vaga_id: number; titulo?: string | null; statusVaga?: number; };
type CandidaturaItem = {
  vaga_id: number;
  curriculum_id: number;
  titulo?: string | null;
  empresa?: string | null;
  dataCandidatura?: string | null;
  statusCandidatura: number;
  candidato_nome?: string | null;
  candidato_email?: string | null;
  candidato_cidade?: string | null;
};

const statusBadges: Record<number, string> = {
  11: "secondary",
  12: "info",
  13: "success",
  14: "danger",
};

async function fetchCandidaturas(vagaId: number) {
  // tenta as 3 variações de rota que seu backend pode mapear
  try {
    const r = await api.get<{ status: number; data: CandidaturaItem[] }>(`/candidatura/porvaga/${vagaId}`);
    return r.data?.data ?? [];
  } catch {
    try {
      const r = await api.get<{ status: number; data: CandidaturaItem[] }>(`/candidatura/por-vaga/${vagaId}`);
      return r.data?.data ?? [];
    } catch {
      const r = await api.get<{ status: number; data: CandidaturaItem[] }>(`/candidatura/porVaga/${vagaId}`);
      return r.data?.data ?? [];
    }
  }
}

export default function ApplicationsGrid() {
  // filtros
  const [vagaId, setVagaId] = useState<number | null>(null);
  const [texto, setTexto] = useState("");
  const [status, setStatus] = useState<number | "all">("all");

  // dados
  const [vagas, setVagas] = useState<VagaEmpresa[]>([]);
  const [items, setItems] = useState<CandidaturaItem[]>([]);
  const [loading, setLoading] = useState(false);

  // paginação
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // ====== ESTADO DO MODAL ======
  const [modalOpen, setModalOpen] = useState(false);
  const [selVagaId, setSelVagaId] = useState<number | null>(null);
  const [selCurriculumId, setSelCurriculumId] = useState<number | null>(null);

  // carrega vagas da empresa
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<{ status: number; data: VagaEmpresa[] }>("/vaga/minhas");
        const rows = data?.data ?? [];
        setVagas(rows);
        if (!vagaId && rows[0]?.vaga_id) setVagaId(rows[0].vaga_id);
      } catch (e) {
        console.error("Falha ao carregar vagas da empresa:", e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // carrega candidaturas da vaga selecionada
  const reload = async () => {
    if (!vagaId) { setItems([]); return; }
    setLoading(true);
    try {
      const rows = await fetchCandidaturas(vagaId);
      setItems(rows);
      setPage(1);
    } catch (e: any) {
      console.error("Falha ao carregar candidaturas:", e?.response?.status, e?.response?.request?.responseURL);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, [vagaId]); // eslint-disable-line

  // filtro + paginação client-side
  const filtered = useMemo(() => {
    const t = texto.trim().toLowerCase();
    return items.filter((it) => {
      if (status !== "all" && it.statusCandidatura !== status) return false;
      if (!t) return true;
      const hay = [
        it.titulo,
        it.empresa,             // irrelevante na visão empresa, mas não atrapalha
        it.candidato_nome,
        it.candidato_email,
        it.candidato_cidade,
      ].filter(Boolean).join(" ").toLowerCase();
      return hay.includes(t);
    });
  }, [items, texto, status]);

  // contadores por status
  const counters = useMemo(() => {
    const c = { total: filtered.length, 11: 0, 12: 0, 13: 0, 14: 0 } as any;
    filtered.forEach((i) => { c[i.statusCandidatura]++; });
    return c;
  }, [filtered]);

  // paginação
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const slice = filtered.slice((page - 1) * pageSize, page * pageSize);

  // ====== HANDLER DO BOTÃO "VISUALIZAR" NA TABELA ======
  const handleView = (vId: number, cId: number) => {
    if (!vId || !cId) {
      alert("IDs inválidos para abrir o modal.");
      return;
    }
    setSelVagaId(vId);
    setSelCurriculumId(cId);
    setModalOpen(true);
  };

  return (
    <Container fluid className="p-0 mt-4">
      {/* Vaga */}
      <Form.Group className="mb-3">
        <Form.Label>Vaga</Form.Label>
        <Form.Select
          value={vagaId ?? ""}
          onChange={(e) => setVagaId(e.target.value ? Number(e.target.value) : null)}
        >
          {vagas.map((v) => (
            <option key={v.vaga_id} value={v.vaga_id}>
              {v.titulo || `Vaga #${v.vaga_id}`}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Filtros */}
      <div className="row g-2">
        <div className="col">
          <Form.Label>Filtrar por texto</Form.Label>
          <Form.Control
            placeholder="Nome, e-mail, cidade, vaga..."
            value={texto}
            onChange={(e) => { setTexto(e.target.value); setPage(1); }}
          />
        </div>
        <div className="col-12 col-md-4">
          <Form.Label>Filtrar por Status</Form.Label>
          <Form.Select
            value={status}
            onChange={(e) => { const v = e.target.value; setStatus(v === "all" ? "all" : Number(v)); setPage(1); }}
          >
            <option value="all">Todos</option>
            <option value={11}>Pendente</option>
            <option value={12}>Em análise</option>
            <option value={13}>Aprovado</option>
            <option value={14}>Reprovado</option>
          </Form.Select>
        </div>
      </div>

      <div className="d-flex gap-2 align-items-center my-3">
        <Button variant="secondary" onClick={reload}>Atualizar</Button>
        <span className="ms-auto d-flex gap-2">
          <Badge bg="secondary">Total {counters.total}</Badge>
          <Badge bg={statusBadges[11]}>Pendente {counters[11]}</Badge>
          <Badge bg={statusBadges[12]}>Em análise {counters[12]}</Badge>
          <Badge bg={statusBadges[13]}>Aprovado {counters[13]}</Badge>
          <Badge bg={statusBadges[14]}>Reprovado {counters[14]}</Badge>
        </span>
      </div>

      {/* Tabela */}
      <div className="border rounded-2 m-0 p-1">
        <ApplicationTable
          view="company"       // <- mostra Nome do candidato
          items={slice}
          loading={loading}
          onView={handleView}  // <- ABRE O MODAL
        />
      </div>

      <PaginationButtons
        className="mt-3"
        active={page}
        total={totalPages}
        onChange={setPage}
      />

      {/* ====== MODAL (RECEBE OS IDs E ABRE) ====== */}
      <ManageCandidateModal
        open={modalOpen}
        vagaId={selVagaId}
        curriculumId={selCurriculumId}
        onClose={() => setModalOpen(false)}
        onSaved={reload}
      />
    </Container>
  );
}
