import { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import api from "@/services/api";
import ExperienceForm from "@/components/user/curriculum/forms/experience";

/* helpers iguais education */
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
function pickCurriculumId(data: unknown): number | null {
  if (!isObj(data)) return null;
  const c =
    (isObj(data.curriculum) ? data.curriculum : undefined) ??
    (isObj(data.data) && isObj(data.data.curriculum) ? data.data.curriculum : undefined);
  if (!isObj(c)) return null;
  return toNum(c.curriculum_id) ?? toNum(c.id);
}

export default function ExperienceSection() {
  const [loadingHead, setLoadingHead] = useState(true);
  const [curriculumId, setCurriculumId] = useState<number>(0);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/usuario/perfil", { withCredentials: true });
        const id = pickCurriculumId(data);
        if (id) setCurriculumId(id);
        else console.warn("[perfil] curriculum_id não encontrado:", data);
      } catch (e) {
        console.error("Falha ao obter /usuario/perfil", e);
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
      <ExperienceForm curriculumId={curriculumId} />
    </Container>
  );
}
