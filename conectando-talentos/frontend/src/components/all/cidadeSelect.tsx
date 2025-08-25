import { useEffect, useMemo, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import api from "@/services/api";

export type CidadeOption = { id: number; nome: string; uf?: string };

interface Props {
  controlId: string;
  label?: string;
  value?: number | string;          // cidade_id atual
  onChange?: (cidadeId: number) => void;
  required?: boolean;
  uf?: string;                      // opcional: filtra por UF (ex: "MG")
  placeholderFirst?: boolean;       // default true
}

/* ---------- helpers de narrowing ---------- */
function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function toNum(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return null;
}
function toStr(v: unknown): string | null {
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  return null;
}

export default function CidadeSelect({
  controlId,
  label = "Cidade *",
  value,
  onChange,
  required,
  uf,
  placeholderFirst = true,
}: Props) {
  const [list, setList] = useState<CidadeOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      try {
        const url = uf ? `/cidade/lista/${encodeURIComponent(uf)}` : "/cidade/lista";
        const { data } = await api.get(url, { withCredentials: true });

        const raw = isObj(data) && Array.isArray((data as any).cidades) // eslint-disable-line @typescript-eslint/no-explicit-any
          ? (data as { cidades: unknown[] }).cidades
          : [];

        if (!cancel) {
          const normalized: CidadeOption[] = raw
            .filter(isObj)
            .map((c) => {
              const id =
                toNum(c.id) ??
                toNum((c as Record<string, unknown>).cidade_id);

              const nome =
                toStr(c.nome) ??
                toStr((c as Record<string, unknown>).cidade);

              const ufStr = toStr(c.uf ?? (c as Record<string, unknown>).estado ?? (c as Record<string, unknown>).sigla) ?? undefined;

              return {
                id: id ?? 0,
                nome: nome ?? "",
                uf: ufStr,
              };
            })
            .filter((c) => c.id > 0 && c.nome.length > 0);

          setList(normalized);
        }
      } catch (e) {
        console.error("Falha ao carregar cidades", e);
        if (!cancel) setList([]);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [uf]);

  const options = useMemo(() => {
    const base = list.map((c) => ({
      id: String(c.id),
      displayName: c.uf ? `${c.nome}/${c.uf}` : c.nome,
    }));
    return placeholderFirst
      ? [{ id: "", displayName: "Selecione" }, ...base]
      : base;
  }, [list, placeholderFirst]);

  const strValue = value ? String(value) : "";

  return (
    <Form.Group controlId={controlId} className="mb-3">
      {label && (
        <Form.Label className="fw-semibold mb-1 ms-1" style={{ fontSize: 14 }}>
          {label} {loading && <Spinner animation="border" size="sm" className="ms-1" />}
        </Form.Label>
      )}
      <Form.Select
        value={strValue}
        onChange={(e) => onChange?.(Number(e.target.value))}
        required={required}
        disabled={loading}
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.displayName}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
}
