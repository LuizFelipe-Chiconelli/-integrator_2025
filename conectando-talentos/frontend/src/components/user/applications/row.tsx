import { Badge, Button } from "react-bootstrap";

export type CandidaturaItem = {
  vaga_id: number;
  curriculum_id: number;

  titulo?: string | null;           // nome da vaga
  empresa?: string | null;          // nome da empresa (para visão do usuário)
  dataCandidatura?: string | null;  // ISO
  statusCandidatura: number;        // 11..14

  candidato_nome?: string | null;   // para visão da empresa
  candidato_email?: string | null;
  candidato_cidade?: string | null;
};

const statusLabel: Record<number, string> = {
  11: "Pendente",
  12: "Em análise",
  13: "Aprovado",
  14: "Reprovado",
};

type Props = {
  item: CandidaturaItem;
  onView: (vaga_id: number, curriculum_id: number) => void;
  /**
   * view:
   * - "company": mostra Nome do candidato
   * - "user": mostra Empresa
   */
  view?: "company" | "user";
};

export default function ApplicationRow({ item, onView, view = "company" }: Props) {
  const dt = item.dataCandidatura
    ? new Date(item.dataCandidatura).toLocaleDateString("pt-BR")
    : "—";

  // conteúdo da 2ª coluna conforme a view
  const secondCol =
    view === "company"
      ? (item.candidato_nome || "—")
      : (item.empresa || "—");

  return (
    <tr className="text-dark-emphasis border-bottom" style={{ height: "60px" }}>
      <td className="ps-2">{item.titulo || "—"}</td>
      <td>{secondCol}</td>
      <td>{dt}</td>
      <td>
        <Badge bg="light" className="text-dark-emphasis">
          {statusLabel[item.statusCandidatura] || "—"}
        </Badge>
      </td>
      <td className="text-end pe-3">
        <Button className="btn-light border" onClick={() => onView(item.vaga_id, item.curriculum_id)}>
          Visualizar
        </Button>
      </td>
    </tr>
  );
}
