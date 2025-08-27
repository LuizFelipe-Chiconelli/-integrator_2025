import { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import api from "@/services/api";
import QualificationForm from "@/components/user/curriculum/forms/qualification";

/* helpers sem any */
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
/** curriculum_id a partir de /usuario/perfil */
function pickCurriculumId(payload: unknown): number | null {
  if (!isObj(payload)) return null;
  const c =
    (isObj(payload.curriculum) ? payload.curriculum : undefined) ??
    (isObj(payload.data) && isObj(payload.data.curriculum) ? payload.data.curriculum : undefined);
  if (!isObj(c)) return null;
  return toNum(c.curriculum_id) ?? toNum(c.id);
}

export default function QualificationSection() {
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
        <h2 className="fs-3 fw-bold m-0">Cursos / Qualificações</h2>
        {loadingHead && <Spinner size="sm" animation="border" />}
      </div>

      {/* passa 0 até carregar; o form só habilita SALVAR quando houver ID */}
      <QualificationForm curriculumId={curriculumId} />
    </Container>
  );
}
