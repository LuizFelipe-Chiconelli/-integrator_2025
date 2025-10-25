"use client";

import { useEffect, useMemo, useState } from "react";
import { Modal, Button, Spinner, Row, Col, Badge, Alert } from "react-bootstrap";
import {
  IoDocumentOutline,
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline,
  IoLinkOutline,
} from "react-icons/io5";
import api from "@/services/api";

type Props = {
  open: boolean;
  vagaId: number | null;
  curriculumId: number | null;
  onClose: () => void;
  onSaved?: () => void;
};

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

function normalizeDetalhe(d: any): DetalheNorm | null {
  if (!d || typeof d !== "object") return null;

  if ("candidato_nome" in d || "candidato_email" in d) {
    return {
      vaga_id: d.vaga_id,
      curriculum_id: d.curriculum_id,
      titulo: d.titulo ?? null,
      statusCandidatura: d.statusCandidatura,
      dataCandidatura: d.dataCandidatura ?? null,
      nome: d.candidato_nome ?? null,
      email: d.candidato_email ?? null,
      telefone: d.candidato_telefone ?? null,
      cidade: d.candidato_cidade ?? null,
      linkedin: d.linkedin ?? null,
      github: d.github ?? null,
      portfolio: d.portfolio ?? null,
      cv_url: d.cv_url ?? null,
      resumo: d.resumo ?? null,
    };
  }

  const pf = d.pessoa_fisica || {};
  const cv = d.curriculum || {};
  const usr = d.usuario || {};

  const cidadeUF =
    (cv?.cidade ? cv.cidade : "") +
    (cv?.uf ? (cv?.cidade ? `, ${cv.uf}` : cv.uf) : "");

  return {
    vaga_id: d.vaga_id,
    curriculum_id: d.curriculum_id,
    titulo: d.titulo ?? null,
    statusCandidatura: d.statusCandidatura,
    dataCandidatura: d.dataCandidatura ?? null,
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
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!open || !vagaId || !curriculumId) {
      setDet(null);
      setError("");
      return;
    }

    (async () => {
      setLoading(true);
      setError("");
      
      try {
        console.log(`🔄 Carregando detalhes: vaga=${vagaId}, curriculum=${curriculumId}`);
        
        // ROTA CORRIGIDA - usando parâmetros na URL
        const { data } = await api.get<{ status: number; data: any }>(
          `/candidatura/detalhe/listar/${vagaId}/${curriculumId}`
        );
        
        console.log("✅ Detalhes carregados:", data);
        
        if (data.status === 200) {
          setDet(normalizeDetalhe(data.data));
        } else {
          setError(data.mensagem || "Erro ao carregar detalhes");
        }
      } catch (e: any) {
        console.error("❌ Erro ao carregar detalhes:", {
          status: e?.response?.status,
          url: e?.response?.request?.responseURL,
          data: e?.response?.data
        });
        
        if (e?.response?.status === 401) {
          setError("Sessão expirada. Faça login novamente.");
        } else if (e?.response?.status === 403) {
          setError("Você não tem permissão para ver estes detalhes.");
        } else if (e?.response?.status === 404) {
          setError("Candidatura não encontrada.");
        } else {
          setError("Erro ao carregar detalhes da candidatura.");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [open, vagaId, curriculumId]);

  const links = useMemo(() => {
    if (!det) return [];
    const arr: Array<{ label: string; href: string }> = [];
    const push = (label: string, url?: string | null) => {
      const href = (url || "").trim();
      if (!href) return;
      arr.push({ label, href: href.startsWith("http") ? href : `https://${href}` });
    };
    push("LinkedIn", det.linkedin);
    push("GitHub", det.github);
    push("Portfólio", det.portfolio);
    push("Currículo (PDF)", det.cv_url);
    return arr;
  }, [det]);

  const handleStatus = async (novo: number) => {
    if (!vagaId || !curriculumId) return;
    
    setBusy(true);
    try {
      console.log(`🔄 Atualizando status para: ${novo}`);
      
      await api.post("/candidatura/status", {
        vaga_id: vagaId,
        curriculum_id: curriculumId,
        statusCandidatura: novo,
      });
      
      setDet((old) => (old ? { ...old, statusCandidatura: novo } : old));
      onSaved?.();
      
      console.log("✅ Status atualizado com sucesso");
    } catch (e: any) {
      console.error("❌ Erro ao atualizar status:", e);
      alert("Falha ao atualizar o status. Tente novamente.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal show={open} onHide={onClose} centered size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          Gerenciar candidatura
          {vagaId && curriculumId && (
            <small className="text-muted d-block fs-6">
              Vaga: {vagaId} | Candidato: {curriculumId}
            </small>
          )}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && (
          <Alert variant="danger">
            {error}
            <div className="mt-2">
              <Button variant="outline-danger" size="sm" onClick={onClose}>
                Fechar
              </Button>
            </div>
          </Alert>
        )}

        {loading && (
          <div className="d-flex align-items-center gap-2 p-3">
            <Spinner size="sm" animation="border" /> Carregando detalhes da candidatura...
          </div>
        )}

        {!loading && det && (
          <>
            <div className="mb-3">
              <h5 className="mb-1">
                {det.nome || "Candidato sem nome"}{" "}
                <Badge bg={statusVariant[det.statusCandidatura] || "secondary"}>
                  {statusOpts.find((s) => s.id === det.statusCandidatura)?.label || "—"}
                </Badge>
              </h5>
              {det.titulo && <div className="text-muted">Vaga: {det.titulo}</div>}
              {det.dataCandidatura && (
                <div className="text-muted">
                  Candidatou-se em {new Date(det.dataCandidatura).toLocaleString("pt-BR")}
                </div>
              )}
            </div>

            <Row className="g-3">
              <Col md={6}>
                <div className="d-flex flex-column gap-2">
                  <h6>Contato</h6>
                  {det.email && (
                    <div className="d-flex align-items-center gap-2">
                      <IoMailOutline /> <a href={`mailto:${det.email}`}>{det.email}</a>
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
                <div className="d-flex flex-column gap-2">
                  <h6>Links</h6>
                  {links.length > 0 ? (
                    links.map((l) => (
                      <div key={l.href} className="d-flex align-items-center gap-2">
                        <IoLinkOutline /> 
                        <a href={l.href} target="_blank" rel="noreferrer">
                          {l.label}
                        </a>
                      </div>
                    ))
                  ) : (
                    <span className="text-muted">Nenhum link disponível</span>
                  )}
                </div>
              </Col>

              {det.resumo && (
                <Col md={12}>
                  <div className="p-3 border rounded">
                    <h6>Resumo Pessoal</h6>
                    <div style={{ whiteSpace: "pre-wrap" }} className="text-muted">
                      {det.resumo}
                    </div>
                  </div>
                </Col>
              )}
            </Row>

            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
              <div>
                <h6>Alterar Status:</h6>
                <div className="d-flex gap-2 flex-wrap">
                  {statusOpts.map((s) => (
                    <Button
                      key={s.id}
                      size="sm"
                      variant={det.statusCandidatura === s.id ? "primary" : "outline-primary"}
                      disabled={busy}
                      onClick={() => handleStatus(s.id)}
                    >
                      {s.label}
                    </Button>
                  ))}
                </div>
              </div>

              {det.cv_url && (
                <a
                  className="btn btn-outline-secondary d-flex align-items-center gap-2"
                  href={det.cv_url.startsWith("http") ? det.cv_url : `https://${det.cv_url}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <IoDocumentOutline /> Abrir currículo
                </a>
              )}
            </div>
          </>
        )}

        {!loading && !det && !error && (
          <div className="text-center p-4 text-muted">
            Nenhum dado disponível para esta candidatura.
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}