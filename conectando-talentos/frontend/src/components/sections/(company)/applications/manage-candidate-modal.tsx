"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Modal, Button, Spinner, Row, Col, Badge } from "react-bootstrap";
import api from "@/services/api";
import {
  IoDocumentOutline,
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline,
  IoLinkOutline,
} from "react-icons/io5";

type Props = {
  open: boolean;
  vagaId: number | null;
  curriculumId: number | null;
  onClose: () => void;
  onSaved?: () => void; // recarregar lista após mudar status
};

/* ===========================
   Formatos aceitos do backend
   =========================== */

// flat (se o /candidatura/detalhe já devolve pronto)
type FlatDetalhe = {
  vaga_id: number;
  curriculum_id: number;
  titulo?: string | null;

  statusCandidatura: number; // 11..14
  dataCandidatura?: string | null;

  candidato_nome?: string | null;
  candidato_email?: string | null;
  candidato_telefone?: string | null;
  candidato_cidade?: string | null;

  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;
  cv_url?: string | null;
  resumo?: string | null;
};

// aninhado (parecido com Usuario::perfil)
type PerfilLike = {
  vaga_id: number;
  curriculum_id: number;
  titulo?: string | null;

  statusCandidatura: number;
  dataCandidatura?: string | null;

  usuario?: {
    id: number;
    login: string;
    tipo: string;
  } | null;

  pessoa_fisica?: {
    nome?: string | null;
    cpf?: string | null;
  } | null;

  curriculum?: {
    email?: string | null;
    celular?: string | null;
    cidade?: string | null; // já calculado no controller
    uf?: string | null;     // já calculado no controller
    apresentacaoPessoal?: string | null;

    linkedin?: string | null;
    github?: string | null;
    portfolio?: string | null;
    cv_url?: string | null;
  } | null;
};

// estrutura interna normalizada
type DetalheNorm = {
  vaga_id: number;
  curriculum_id: number;
  titulo?: string | null;

  statusCandidatura: number;
  dataCandidatura?: string | null;

  nome?: string | null;
  email?: string | null;
  telefone?: string | null;
  cidade?: string | null;

  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;
  cv_url?: string | null;
  resumo?: string | null;
};

const statusOpts = [
  { id: 11, label: "Pendente" },
  { id: 12, label: "Em análise" },
  { id: 13, label: "Aprovado" },
  { id: 14, label: "Reprovado" },
];

const statusVariant: Record<number, string> = {
  11: "secondary",
  12: "info",
  13: "success",
  14: "danger",
};

// util: sempre devolver uma URL com http(s)
const safeHttp = (url?: string | null) => {
  const s = (url || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  return `https://${s}`;
};

// util: exibe data/hora pt-BR com fallback
const formatDateTime = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(+d)
    ? ""
    : d.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};

// Normaliza a resposta (flat OU aninhada) para DetalheNorm
function normalizeDetalhe(d: any): DetalheNorm | null {
  if (!d || typeof d !== "object") return null;

  // Se já vier no formato “flat”
  if ("candidato_nome" in d || "candidato_email" in d) {
    const flat = d as FlatDetalhe;
    return {
      vaga_id: flat.vaga_id,
      curriculum_id: flat.curriculum_id,
      titulo: flat.titulo ?? null,
      statusCandidatura: flat.statusCandidatura,
      dataCandidatura: flat.dataCandidatura ?? null,
      nome: flat.candidato_nome ?? null,
      email: flat.candidato_email ?? null,
      telefone: flat.candidato_telefone ?? null,
      cidade: flat.candidato_cidade ?? null,
      linkedin: flat.linkedin ?? null,
      github: flat.github ?? null,
      portfolio: flat.portfolio ?? null,
      cv_url: flat.cv_url ?? null,
      resumo: flat.resumo ?? null,
    };
  }

  // Caso venha aninhado (perfil-like)
  const P = (d as PerfilLike) || ({} as PerfilLike);
  const pf = P.pessoa_fisica || {};
  const cv = P.curriculum || {};
  const usr = P.usuario || {};

  const cidadeUF =
    (cv.cidade ? cv.cidade : "") +
    (cv.uf ? (cv.cidade ? `, ${cv.uf}` : cv.uf) : "");

  return {
    vaga_id: P.vaga_id,
    curriculum_id: P.curriculum_id,
    titulo: P.titulo ?? null,
    statusCandidatura: P.statusCandidatura,
    dataCandidatura: P.dataCandidatura ?? null,

    nome: pf?.nome ?? null,
    email: cv?.email ?? usr?.login ?? null,
    telefone: cv?.celular ?? null,
    cidade: cidadeUF || null,

    linkedin: cv?.linkedin ?? null,
    github: cv?.github ?? null,
    portfolio: cv?.portfolio ?? null,
    cv_url: cv?.cv_url ?? null,
    resumo: cv?.apresentacaoPessoal ?? null,
  };
}

export default function ManageCandidateModal({
  open,
  vagaId,
  curriculumId,
  onClose,
  onSaved,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [det, setDet] = useState<DetalheNorm | null>(null);
  const aliveRef = useRef(true);

  // limpa quando fecha
  useEffect(() => {
    if (!open) setDet(null);
  }, [open]);

  // flag de vida do componente (evita setState após unmount)
  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  // carrega detalhe
  useEffect(() => {
    if (!open || !vagaId || !curriculumId) return;

    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get<{ status: number; data: any }>(
          `/candidatura/detalhe?vaga_id=${vagaId}&curriculum_id=${curriculumId}`
        );
        const norm = normalizeDetalhe(data?.data);
        if (aliveRef.current) setDet(norm);
      } catch (e) {
        console.error(e);
        alert("Falha ao carregar a candidatura.");
        onClose();
      } finally {
        if (aliveRef.current) setLoading(false);
      }
    })();
  }, [open, vagaId, curriculumId, onClose]);

  // atualizar status
  const handleStatus = async (novo: number) => {
    if (!vagaId || !curriculumId) return;
    setBusy(true);
    try {
      await api.post("/candidatura/status", {
        vaga_id: vagaId,
        curriculum_id: curriculumId,
        statusCandidatura: novo,
      });
      if (aliveRef.current) {
        setDet((old) => (old ? { ...old, statusCandidatura: novo } : old));
      }
      onSaved?.();
    } catch (e) {
      console.error(e);
      alert("Falha ao atualizar o status.");
    } finally {
      if (aliveRef.current) setBusy(false);
    }
  };

  return (
    <Modal show={open} onHide={onClose} centered size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Gerenciar candidatura</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading || !det ? (
          <div className="d-flex align-items-center gap-2">
            <Spinner size="sm" animation="border" /> Carregando…
          </div>
        ) : (
          <>
            <div className="mb-3">
              <h5 className="mb-1 d-flex align-items-center gap-2">
                <span>{det.nome || "Candidato"}</span>
                <Badge bg={statusVariant[det.statusCandidatura] || "secondary"}>
                  {statusOpts.find((s) => s.id === det.statusCandidatura)?.label ||
                    "—"}
                </Badge>
              </h5>

              {det.titulo && (
                <div className="text-muted">Vaga: {det.titulo}</div>
              )}

              {!!det.dataCandidatura && (
                <div className="text-muted">
                  Candidatou-se em {formatDateTime(det.dataCandidatura)}
                </div>
              )}
            </div>

            <Row className="g-3">
              <Col md={6}>
                <div className="d-flex flex-column gap-1">
                  {det.email && (
                    <div className="d-flex align-items-center gap-2">
                      <IoMailOutline />{" "}
                      <a href={`mailto:${det.email}`}>{det.email}</a>
                    </div>
                  )}
                  {det.telefone && (
                    <div className="d-flex align-items-center gap-2">
                      <IoCallOutline /> <span>{det.telefone}</span>
                    </div>
                  )}
                  {det.cidade && (
                    <div className="d-flex align-items-center gap-2">
                      <IoLocationOutline /> <span>{det.cidade}</span>
                    </div>
                  )}
                </div>
              </Col>

              <Col md={6}>
                <div className="d-flex flex-column gap-1">
                  {[
                    { label: "LinkedIn", url: det.linkedin },
                    { label: "GitHub", url: det.github },
                    { label: "Portfólio", url: det.portfolio },
                    { label: "Currículo (PDF)", url: det.cv_url },
                  ]
                    .map(({ label, url }) => ({
                      label,
                      href: safeHttp(url),
                    }))
                    .filter((l) => l.href)
                    .map((l) => (
                      <div key={l.href} className="d-flex align-items-center gap-2">
                        <IoLinkOutline />
                        <a href={l.href} target="_blank" rel="noreferrer">
                          {l.label}
                        </a>
                      </div>
                    ))}
                </div>
              </Col>

              {det.resumo && (
                <Col md={12}>
                  <div className="p-2 border rounded">
                    <div className="fw-semibold mb-1">Resumo</div>
                    <div style={{ whiteSpace: "pre-wrap" }}>{det.resumo}</div>
                  </div>
                </Col>
              )}
            </Row>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="d-flex gap-2 flex-wrap">
                {statusOpts.map((s) => (
                  <Button
                    key={s.id}
                    size="sm"
                    variant={
                      det.statusCandidatura === s.id
                        ? "primary"
                        : "outline-primary"
                    }
                    disabled={busy}
                    onClick={() => handleStatus(s.id)}
                  >
                    {s.label}
                  </Button>
                ))}
              </div>

              {det.cv_url && (
                <a
                  className="btn btn-outline-secondary d-flex align-items-center gap-2"
                  href={safeHttp(det.cv_url)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <IoDocumentOutline /> Abrir currículo
                </a>
              )}
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}
