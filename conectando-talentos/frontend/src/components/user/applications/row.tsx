import { Badge, Button } from "react-bootstrap";

export type CandidaturaItem = {
  vaga_id: number;
  curriculum_id: number;

  // preenchidos pelo JOIN no backend
  titulo?: string | null;          // nome da vaga
  empresa?: string | null;         // nome fantasia / razão da empresa

  dataCandidatura?: string | null; // ISO: "YYYY-MM-DD" ou "YYYY-MM-DD HH:MM:SS"
  statusCandidatura: number;       // 11..14
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
};

// evita timezone empurrar a data
function fmtDateBR(ts?: string | null) {
  if (!ts) return "—";
  const [d] = ts.split(" ");
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

export default function ApplicationRow({ item, onView }: Props) {
  const dt = fmtDateBR(item.dataCandidatura);

  return (
    <tr className="text-dark-emphasis border-bottom" style={{ height: "60px" }}>
      <td className="ps-2">{item.titulo || "—"}</td>
      <td>{item.empresa || "—"}</td>
      <td>{dt}</td>
      <td>
        <Badge bg="light" className="text-dark-emphasis">
          {statusLabel[item.statusCandidatura] || "—"}
        </Badge>
      </td>
      <td className="text-end pe-3">
        <Button
          className="btn-light border"
          onClick={() => onView(item.vaga_id, item.curriculum_id)}
        >
          Visualizar
        </Button>
      </td>
    </tr>
  );
}
