import { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import api from "@/services/api";
import Education from "@/components/user/curriculum/forms/education_old";

import EducationForm from "@/components/user/curriculum/forms/education";

/** Helpers de narrowing (sem any) */
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

/** Extrai curriculum_id de /usuario/perfil (sem usar any) */
function pickCurriculumId(data: unknown): number | null {
  if (!isObj(data)) return null;

  // pode vir em data.curriculum ou data.data.curriculum
  const c =
    (isObj(data.curriculum) ? data.curriculum : undefined) ??
    (isObj(data.data) && isObj(data.data.curriculum) ? data.data.curriculum : undefined);

  if (!isObj(c)) return null;

  // aceita curriculum_id ou id
  return toNum(c.curriculum_id) ?? toNum(c.id);
}

export default function EducationSection() {
  const [loadingHead, setLoadingHead] = useState(true);
  // const [curriculumId, setCurriculumId] = useState<number>(0);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const { data } = await api.get("/usuario/perfil", { withCredentials: true });
  //       const id = pickCurriculumId(data);
  //       if (id) setCurriculumId(id);
  //       else console.warn("[perfil] curriculum_id não encontrado:", data);
  //     } catch (e) {
  //       console.error("Falha ao obter /usuario/perfil", e);
  //     } finally {
  //       setLoadingHead(false);
  //     }
  //   })();
  // }, []);

  return (
    <Container className="bg-white border rounded-3 p-4 shadow-sm">
      <div className="d-flex align-items-center gap-2 mb-2">
        <h2 className="fs-3 fw-bold m-0">Escolaridade</h2>
        {loadingHead && <Spinner size="sm" animation="border" />}
      </div>

      {/* passa 0 até carregar; o form só habilita SALVAR quando houver ID */}
      <EducationForm />
      {/* <Education curriculumId={curriculumId} /> */}
    </Container>
  );
}
