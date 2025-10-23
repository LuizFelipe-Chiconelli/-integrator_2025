import ApplicationRow, { type CandidaturaItem } from "./row";
import "./table.css";

type Props = {
  items: CandidaturaItem[];
  loading?: boolean;
  onView: (vaga_id: number, curriculum_id: number) => void;
};

export default function ApplicationTable({ items, loading = false, onView }: Props) {
  return (
    <table className="w-100">
      <thead className="border-bottom">
        <tr style={{ height: "40px" }}>
          <th className="text-light-emphasis ps-2">Vaga</th>
          <th className="text-dark-emphasis">Empresa</th>
          <th className="text-dark-emphasis">Data</th>
          <th className="text-dark-emphasis">Status</th>
          <th className="text-dark-emphasis text-end pe-3">Ações</th>
        </tr>
      </thead>

      <tbody>
        {loading ? (
          <tr>
            <td className="p-3 text-muted" colSpan={5}>Carregando…</td>
          </tr>
        ) : items.length === 0 ? (
          <tr>
            <td className="p-3 text-muted" colSpan={5}>Nenhuma candidatura encontrada.</td>
          </tr>
        ) : (
          items.map((it) => (
            <ApplicationRow key={`${it.vaga_id}-${it.curriculum_id}`} item={it} onView={onView} />
          ))
        )}
      </tbody>
    </table>
  );
}
