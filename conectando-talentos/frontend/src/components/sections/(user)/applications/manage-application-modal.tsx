"use client";

import { useEffect, useMemo, useState } from "react";
import { Modal, Button, Spinner, Row, Col, Badge } from "react-bootstrap";
import {
  IoLocationOutline,
  IoTimeOutline,
  IoCashOutline,
} from "react-icons/io5";
import api from "@/services/api";

type Props = {
  open: boolean;
  vagaId: number | null;
  /** dados já exibidos na tabela (opcional, só para mostrar algo enquanto carrega) */
  prefill?: {
    titulo?: string | null;
    empresa?: string | null;
    dataCandidatura?: string | null;
    statusCandidatura?: number;
  } | null;
  onClose: () => void;
  /** chamado após cancelar a candidatura para recarregar a grid */
  onSaved?: () => void;
};

type VagaDetalhe = {
  vaga_id: number;
  titulo?: string | null;
  descricao?: string | null;
  requisitos?: string | null;
  localizacao?: string | null;
  salario?: string | number | null;
  dtFim?: string | null; // yyyy-mm-dd
  cargo_descricao?: string | null;
  // se seu detalhe trouxer:
  empresa?: string | null;
};

const statusLabel: Record<number, string> = {
  11: "Pendente",
  12: "Em análise",
  13: "Aprovado",
  14: "Reprovado",
};

const statusVariant: Record<number, string> = {
  11: "secondary",
  12: "info",
  13: "success",
  14: "danger",
};

function fmtDateISO(d?: string | null) {
  if (!d) return "";
  const [y, m, day] = d.split(" ")[0].split("-");
  return `${day}/${m}/${y}`;
}

function fmtDateYMD(d?: string | null) {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

export default function ManageUserApplicationModal({
  open,
  vagaId,
  prefill,
  onClose,
  onSaved,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [det, setDet] = useState<VagaDetalhe | null>(null);

  // carrega detalhe da vaga
  useEffect(() => {
    if (!open || !vagaId) return;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get<{ status: number; data: VagaDetalhe }>(
          `/vaga/detalhe/${vagaId}`
        );
        setDet(data?.data || null);
      } catch (e) {
        console.error(e);
        setDet(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, vagaId]);

  const titulo = useMemo(() => {
    return det?.titulo || prefill?.titulo || det?.cargo_descricao || "Vaga";
  }, [det, prefill]);

  const empresa = det?.empresa ?? prefill?.empresa ?? null;
  const statusCandidatura = prefill?.statusCandidatura ?? 11;
  const dataCand = prefill?.dataCandidatura ? fmtDateISO(prefill?.dataCandidatura) : "—";

  const handleCancel = async () => {
    if (!vagaId) return;
    if (!confirm("Tem certeza que deseja cancelar sua candidatura?")) return;
    setBusy(true);
    try {
      // axios delete: body deve ir em { data: { ... } }
      const { data } = await api.delete("/candidatura/remover", {
        data: { vaga_id: vagaId },
      });
      if (data?.status === 200) {
        alert("Candidatura cancelada.");
        onSaved?.();
        onClose();
      } else {
        alert(data?.mensagem || "Não foi possível cancelar a candidatura.");
      }
    } catch (e) {
      console.error(e);
      alert("Falha ao cancelar candidatura.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal show={open} onHide={onClose} centered size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Detalhes da candidatura</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="d-flex align-items-center gap-2">
            <Spinner size="sm" animation="border" /> Carregando…
          </div>
        ) : (
          <>
            <div className="mb-3">
              <h5 className="mb-1 d-flex align-items-center gap-2 flex-wrap">
                <span>{titulo}</span>
                <Badge bg={statusVariant[statusCandidatura] || "secondary"}>
                  {statusLabel[statusCandidatura] || "—"}
                </Badge>
              </h5>
              {empresa && <div className="text-muted">Empresa: {empresa}</div>}
              <div className="text-muted">
                Candidatou-se em {dataCand}
              </div>
            </div>

            <Row className="g-3">
              <Col md={6}>
                {det?.localizacao && (
                  <div className="d-flex align-items-center gap-2">
                    <IoLocationOutline /> {det.localizacao}
                  </div>
                )}
              </Col>
              <Col md={6} className="d-flex gap-3">
                {det?.salario && (
                  <div className="d-flex align-items-center gap-2">
                    <IoCashOutline /> {String(det.salario)}
                  </div>
                )}
                {det?.dtFim && (
                  <div className="d-flex align-items-center gap-2">
                    <IoTimeOutline /> até {fmtDateYMD(det.dtFim)}
                  </div>
                )}
              </Col>

              {(det?.descricao || det?.requisitos) && (
                <Col xs={12}>
                  {det?.descricao && (
                    <div className="p-2 border rounded mb-2">
                      <div className="fw-semibold mb-1">Descrição</div>
                      <div style={{ whiteSpace: "pre-wrap" }}>{det.descricao}</div>
                    </div>
                  )}
                  {det?.requisitos && (
                    <div className="p-2 border rounded">
                      <div className="fw-semibold mb-1">Requisitos</div>
                      <div style={{ whiteSpace: "pre-wrap" }}>{det.requisitos}</div>
                    </div>
                  )}
                </Col>
              )}
            </Row>
          </>
        )}
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="outline-secondary" onClick={onClose}>
          Fechar
        </Button>
        <Button variant="danger" disabled={busy || loading} onClick={handleCancel}>
          Cancelar candidatura
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
