"use client";

import { useEffect, useMemo, useState } from "react";
import { Container, Form, Button, Badge, Alert } from "react-bootstrap";
import api from "@/services/api";
import ApplicationTable from "@/components/user/applications/table";
import PaginationButtons from "@/components/all/pagination";
import ManageCandidateModal from "@/components/sections/(company)/applications/manage-candidate-modal";

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

export default function ApplicationsGrid() {
  const [vagaId, setVagaId] = useState<number | null>(null);
  const [texto, setTexto] = useState("");
  const [status, setStatus] = useState<number | "all">("all");

  const [vagas, setVagas] = useState<VagaEmpresa[]>([]);
  const [items, setItems] = useState<CandidaturaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [page, setPage] = useState(1);
  const pageSize = 10;

  // modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selVagaId, setSelVagaId] = useState<number | null>(null);
  const [selCurriculumId, setSelCurriculumId] = useState<number | null>(null);

  // Teste básico de sessão
  const testSession = async () => {
    try {
      const { data } = await api.get("/candidatura/whoami");
      console.log("🚀 Dados da sessão:", data);
    } catch (e: any) {
      console.error("❌ Erro na sessão:", e?.response?.data);
    }
  };

  // carrega vagas
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<{ status: number; data: VagaEmpresa[] }>("/vaga/minhas");
        const rows = data?.data ?? [];
        setVagas(rows);
        if (!vagaId && rows[0]?.vaga_id) setVagaId(rows[0].vaga_id);
        setError("");
      } catch (e: any) {
        console.error("❌ Falha ao carregar vagas:", e);
        setError("Erro ao carregar vagas da empresa");
      }
    })();
    
    // Testa sessão ao carregar
    testSession();
  }, []);

  // carrega candidaturas via /candidatura/porVaga/listar/{id} - ROTA CORRIGIDA
  const reload = async () => {
    if (!vagaId) { 
      setItems([]); 
      return; 
    }
    
    setLoading(true);
    setError("");
    
    try {
      console.log(`🔄 Carregando candidaturas para vaga: ${vagaId}`);
      
      const { data } = await api.get<{ status: number; data: CandidaturaItem[] }>(
        `/candidatura/porVaga/listar/${vagaId}` // ROTA CORRIGIDA
      );
      
      console.log("✅ Resposta da API:", data);
      
      if (data.status === 200) {
        setItems(data?.data ?? []);
        setPage(1);
      } else {
        setError(data.mensagem || "Erro ao carregar candidaturas");
        setItems([]);
      }
    } catch (e: any) {
      console.error("❌ Erro na requisição:", {
        status: e?.response?.status,
        url: e?.response?.request?.responseURL,
        data: e?.response?.data
      });
      
      if (e?.response?.status === 401) {
        setError("Não autenticado. Faça login novamente.");
      } else if (e?.response?.status === 403) {
        setError("Você não tem permissão para ver esta vaga.");
      } else if (e?.response?.status === 404) {
        setError("Rota não encontrada. Verifique a URL.");
      } else {
        setError("Erro ao carregar candidaturas. Tente novamente.");
      }
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (vagaId) reload(); 
  }, [vagaId]);

  // filtro/paginação
  const filtered = useMemo(() => {
    const t = texto.trim().toLowerCase();
    return items.filter((it) => {
      if (status !== "all" && it.statusCandidatura !== status) return false;
      if (!t) return true;
      const hay = [
        it.titulo,
        it.empresa,
        it.candidato_nome,
        it.candidato_email,
        it.candidato_cidade,
      ].filter(Boolean).join(" ").toLowerCase();
      return hay.includes(t);
    });
  }, [items, texto, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const slice = filtered.slice((page - 1) * pageSize, page * pageSize);

  const counters = useMemo(() => {
    const c = { total: filtered.length, 11: 0, 12: 0, 13: 0, 14: 0 } as any;
    filtered.forEach((i) => { c[i.statusCandidatura]++; });
    return c;
  }, [filtered]);

  const handleView = (vaga_id: number, curriculum_id: number) => {
    setSelVagaId(vaga_id);
    setSelCurriculumId(curriculum_id);
    setModalOpen(true);
  };

  return (
    <Container fluid className="p-0 mt-4">
      {/* Debug Info */}
      <div className="mb-3 p-2 border rounded bg-light">
        <small className="text-muted">
          <strong>Debug:</strong> Vaga selecionada: {vagaId || "Nenhuma"} | 
          Total de vagas: {vagas.length} | 
          Candidaturas carregadas: {items.length}
        </small>
      </div>

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
          <div className="mt-2">
            <Button variant="outline-danger" size="sm" onClick={testSession}>
              Testar Sessão
            </Button>
            <Button variant="outline-primary" size="sm" className="ms-2" onClick={reload}>
              Tentar Novamente
            </Button>
          </div>
        </Alert>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Vaga</Form.Label>
        <Form.Select
          value={vagaId ?? ""}
          onChange={(e) => setVagaId(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">Selecione uma vaga</option>
          {vagas.map((v) => (
            <option key={v.vaga_id} value={v.vaga_id}>
              {v.titulo || `Vaga #${v.vaga_id}`} {v.statusVaga ? `(Status: ${v.statusVaga})` : ''}
            </option>
          ))}
        </Form.Select>
        {vagas.length === 0 && (
          <Form.Text className="text-warning">
            Nenhuma vaga encontrada para sua empresa.
          </Form.Text>
        )}
      </Form.Group>

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
        <Button variant="primary" onClick={reload} disabled={loading}>
          {loading ? "Carregando..." : "Atualizar"}
        </Button>
        <span className="ms-auto d-flex gap-2">
          <Badge bg="secondary">Total {counters.total}</Badge>
          <Badge bg={statusBadges[11]}>Pendente {counters[11]}</Badge>
          <Badge bg={statusBadges[12]}>Em análise {counters[12]}</Badge>
          <Badge bg={statusBadges[13]}>Aprovado {counters[13]}</Badge>
          <Badge bg={statusBadges[14]}>Reprovado {counters[14]}</Badge>
        </span>
      </div>

      <div className="border rounded-2 m-0 p-1">
        {loading ? (
          <div className="text-center p-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <div className="mt-2">Carregando candidaturas...</div>
          </div>
        ) : (
          <ApplicationTable
            view="company"
            items={slice}
            loading={false}
            onView={handleView}
          />
        )}
      </div>

      {filtered.length > 0 && (
        <PaginationButtons
          className="mt-3"
          active={page}
          total={totalPages}
          onChange={setPage}
        />
      )}

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