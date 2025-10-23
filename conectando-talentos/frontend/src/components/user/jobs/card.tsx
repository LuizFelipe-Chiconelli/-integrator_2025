"use client";

import { Button, Card } from "react-bootstrap";
import { IoTimeOutline, IoLocationOutline } from "react-icons/io5";
import { LuDollarSign } from "react-icons/lu";

export type UserJobCardProps = {
  vaga_id: number;
  titulo?: string | null;
  cargo_descricao?: string | null;
  descricao?: string | null;
  requisitos?: string | null;
  localizacao?: string | null;
  salario?: string | number | null;
  dtFim?: string | null; // yyyy-mm-dd

  onApply?: (vagaId: number) => void;

  /** status da candidatura do usuário nesta vaga (se já estiver inscrito) */
  appliedStatus?: number; // 11..14
};

const fmtDate = (d?: string | null) => {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
};

const statusLabel: Record<number, string> = {
  11: "Pendente",
  12: "Em análise",
  13: "Aprovado",
  14: "Reprovado",
};

export default function JobCard({
  vaga_id,
  titulo,
  cargo_descricao,
  descricao,
  requisitos,
  localizacao,
  salario,
  dtFim,
  onApply,
  appliedStatus,
}: UserJobCardProps) {
  const title = titulo || cargo_descricao || "Vaga";
  const already = typeof appliedStatus === "number";
  const btnText = already ? (statusLabel[appliedStatus!] || "Inscrito") : "Candidatar-se";

  return (
    <Card className="w-full">
      <Card.Body className="d-flex justify-content-between">
        {/* Esquerda */}
        <div className="d-flex flex-column">
          <div className="d-flex flex-column">
            <h3 className="fw-semibold mb-1" style={{ fontSize: 20 }}>
              {title}
            </h3>
          </div>

          {(descricao || requisitos) && (
            <div className="text-6 mt-2" style={{ fontSize: 16 }}>
              <p className="mb-0">
                {(descricao || requisitos || "").slice(0, 180)}
                {(descricao || requisitos || "").length > 180 ? "…" : ""}
              </p>
            </div>
          )}

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
          </div>
        </div>

        {/* Direita */}
        <div className="d-flex justify-content-end align-items-start">
          <Button
            type="button"
            style={{ fontSize: 14, paddingLeft: 10, paddingRight: 10 }}
            variant={already ? "outline-secondary" : "primary"}
            disabled={already}
            onClick={() => !already && onApply?.(vaga_id)}
          >
            {btnText}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
