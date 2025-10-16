"use client";

import { Button, Card } from "react-bootstrap";
import { IoTimeOutline, IoLocationOutline } from "react-icons/io5";
import { LuBuilding, LuUser, LuDollarSign } from "react-icons/lu";

export type JobCardProps = {
  vaga_id: number;
  titulo?: string | null;
  cargo_descricao?: string | null;
  requisitos?: string | null;
  localizacao?: string | null;
  salario?: string | number | null;
  dtFim?: string | null;       // yyyy-mm-dd
  statusVaga: number;
  onManage?: (id: number) => void;
};

const statusLabel: Record<number, string> = {
  11: "Em aberto",
  12: "Pausada",
  13: "Encerrada",
  14: "Cancelada",
};

const fmtDate = (d?: string | null) => {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
};

export default function JobCard({
  vaga_id,
  titulo,
  cargo_descricao,
  requisitos,
  localizacao,
  salario,
  dtFim,
  statusVaga,
  onManage,
}: JobCardProps) {
  return (
    <Card className="w-full">
      <Card.Body className="d-flex justify-content-between">
        {/* Esquerda */}
        <div className="d-flex flex-column">
          {/* Título */}
          <div className="d-flex flex-column">
            <h3 className="fw-semibold mb-1" style={{ fontSize: 20 }}>
              {titulo || cargo_descricao || "Vaga"}
            </h3>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              {cargo_descricao && (
                <span className="d-flex align-items-center gap-1">
                  <LuBuilding style={{ fontSize: 16 }} />
                  <span style={{ fontSize: 14 }}>{cargo_descricao}</span>
                </span>
              )}

              <span className="badge bg-light text-dark ms-2" style={{ fontSize: 12 }}>
                {statusLabel[statusVaga] || "—"}
              </span>
            </div>
          </div>

          {/* Descrição (requisitos) */}
          {requisitos && (
            <div className="text-6 mt-3" style={{ fontSize: 16 }}>
              <p className="mb-0">{requisitos}</p>
            </div>
          )}

          {/* Informações rápidas */}
          <div className="d-flex gap-3 mt-3 flex-wrap text-muted">
            {localizacao && (
              <div className="d-flex align-items-center gap-2">
                <IoLocationOutline /> {localizacao}
              </div>
            )}

            {salario && (
              <div className="d-flex align-items-center gap-2">
                <LuDollarSign /> {String(salario)}
              </div>
            )}

            {dtFim && (
              <div className="d-flex align-items-center gap-2">
                <IoTimeOutline /> até {fmtDate(dtFim)}
              </div>
            )}

            <div className="d-flex align-items-center gap-2">
              <LuUser /> —
            </div>
          </div>
        </div>

        {/* Direita */}
        <div className="d-flex justify-content-end align-items-start">
          <Button style={{ fontSize: 15 }} onClick={() => onManage?.(vaga_id)}>
            Gerenciar
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
