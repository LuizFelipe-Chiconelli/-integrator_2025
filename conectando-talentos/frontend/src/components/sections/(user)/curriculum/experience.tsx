import { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import api from "@/services/api";
import ExperienceForm, { type Option } from "@/components/user/curriculum/forms/experience";

/* ---------- helpers de narrowing (sem any) ---------- */
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

/** Extrai curriculum_id de /usuario/perfil */
function pickCurriculumId(payload: unknown): number | null {
  if (!isObj(payload)) return null;

  const c =
    (isObj(payload.curriculum) ? payload.curriculum : undefined) ??
    (isObj(payload.data) && isObj((payload.data as Record<string, unknown>).curriculum)
      ? (payload.data as Record<string, unknown>).curriculum
      : undefined);

  if (!isObj(c)) return null;
  return toNum((c as Record<string, unknown>).curriculum_id) ?? toNum((c as Record<string, unknown>).id);
}

/** Converte resposta de cargos em Options para <Select> */
function toCargoOptions(payload: unknown): Option[] {
  const d = isObj(payload) ? payload : {};
  const root = isObj((d as Record<string, unknown>).data)
    ? ((d as Record<string, unknown>).data as Record<string, unknown>)
    : (d as Record<string, unknown>);

  const list = Array.isArray(root.cargos) ? (root.cargos as unknown[]) : [];

  const out: Option[] = [];
  for (const item of list) {
    if (isObj(item)) {
      const id = toNum((item as Record<string, unknown>).cargo_id);
      const desc = (item as Record<string, unknown>).descricao;
      if (id && typeof desc === "string" && desc.trim() !== "") {
        out.push({ id: String(id), displayName: desc });
      }
    }
  }
  return [{ id: "", displayName: "Selecione" }, ...out];
}

export default function ExperienceSection() {
  const [loadingHead, setLoadingHead] = useState(true);
  const [curriculumId, setCurriculumId] = useState<number>(0);
  const [cargoOptions, setCargoOptions] = useState<Option[]>([]);

  useEffect(() => {
    (async () => {
      try {
        // 1) curriculum_id
        const perfil = await api.get("/usuario/perfil", { withCredentials: true });
        const id = pickCurriculumId(perfil.data);
        if (id) setCurriculumId(id);
        else console.warn("[perfil] curriculum_id não encontrado:", perfil.data);

        // 2) lista de cargos (AGORA via /experiencia/cargos)
        const cargosResp = await api.get("/experiencia/cargos", { withCredentials: true });
        setCargoOptions(toCargoOptions(cargosResp.data));
      } catch (e) {
        console.error("Falha ao carregar página de experiência:", e);
        setCargoOptions([{ id: "", displayName: "Selecione" }]);
      } finally {
        setLoadingHead(false);
      }
    })();
  }, []);

  return (
    <Container className="bg-white border rounded-3 p-4 shadow-sm">
      <div className="d-flex align-items-center gap-2 mb-2">
        <h2 className="fs-3 fw-bold m-0">Experiência Profissional</h2>
        {loadingHead && <Spinner size="sm" animation="border" />}
      </div>

      <ExperienceForm curriculumId={curriculumId} cargoOptions={cargoOptions} />
    </Container>
  );
}
