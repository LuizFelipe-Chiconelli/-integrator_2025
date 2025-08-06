import { useEffect, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { BsTrash } from "react-icons/bs";

import api from "@/services/api";
import Select from "@/components/all/select";
import TextInput from "@/components/all/textinput";

/* -------------------------------------------------------------------------- */
/*                             types & constants                              */
/* -------------------------------------------------------------------------- */

export interface EducationData {
  curriculum_curriculum_id: number;
  grau: string;
  descricao: string;
  instituicao: string;
  cidade: string;
  inicioMes: number;
  inicioAno: number;
  fimMes: number;
  fimAno: number;
}

interface RawEdu extends Partial<EducationData> {
  curriculum_escolaridade_id?: number;
}

interface EducationSectionProps {
  curriculumId: number; // FK do currículo principal (obrigatória)
}

const defaultYear = new Date().getFullYear();

const monthOptions = [
  { id: "", displayName: "Selecione" },
  ...["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"].map((m,i)=>({id:(i+1).toString(),displayName:m}))
];

const grauOptions = [
  { id: "", displayName: "Selecione" },
  { id: "fundamental", displayName: "Ensino Fundamental" },
  { id: "medio", displayName: "Ensino Médio" },
  { id: "tecnico", displayName: "Técnico" },
  { id: "graduacao", displayName: "Graduação" },
  { id: "pos", displayName: "Pós‑Graduação" },
  { id: "mestrado", displayName: "Mestrado" },
  { id: "doutorado", displayName: "Doutorado" }
];

/* -------------------------------------------------------------------------- */
/*                          FORMULÁRIO INDIVIDUAL                             */
/* -------------------------------------------------------------------------- */

interface EducationFormProps {
  id: number | string;
  initialData: EducationData;
  onChange?: (id: number | string, data: EducationData) => void;
  onSave?: (id: number | string, data: EducationData) => void;
  onDelete?: (id: number | string) => void;
}

function EducationItemForm({ id, initialData, onChange, onSave, onDelete }: EducationFormProps) {
  const [form, setForm] = useState<EducationData>(initialData);

  /* notifica o pai sempre que algo mudar */
  useEffect(() => {
    onChange?.(id, form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  /* handlers --------------------------- */
  const handleSelect = (field: keyof EducationData) => (value: string) =>
    setForm(prev => ({
      ...prev,
      [field]: field.includes("Mes") && value !== "" ? Number(value) : value
    }));

  const handleText = (field: keyof EducationData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.currentTarget.value;
      const parsed = field.includes("Ano") ? Number(raw) : raw;
      setForm(prev => ({ ...prev, [field]: parsed as never }));
    };

  /* render ----------------------------- */
  return (
    <Form className="border rounded-2 mt-3 p-4 shadow-sm bg-body">
      <h3 className="fs-5 fw-bold mb-4">Escolaridade</h3>

      {/* linha 1 */}
      <div className="row row-cols-lg-2 g-3">
        <Select
          controlId={`grau-${id}`}
          label="Grau escolar *"
          options={grauOptions}
          onChange={handleSelect("grau")}
          required
        />
        <TextInput
          id={`descricao-${id}`}
          label="Curso / Descrição *"
          placeholder="Análise e Desenvolvimento de Sistemas"
          value={form.descricao}
          onChange={handleText("descricao")}
          required
        />
      </div>

      {/* linha 2 */}
      <div className="row row-cols-lg-2 g-3 mt-2">
        <TextInput
          id={`instituicao-${id}`}
          label="Instituição *"
          placeholder="Faculdade ..."
          value={form.instituicao}
          onChange={handleText("instituicao")}
          required
        />
        <TextInput
          id={`cidade-${id}`}
          label="Cidade *"
          placeholder="Muriaé"
          value={form.cidade}
          onChange={handleText("cidade")}
          required
        />
      </div>

      {/* linha 3 */}
      <div className="row row-cols-lg-4 g-3 mt-2">
        <Select
          controlId={`inicioMes-${id}`}
          label="Mês de Início *"
          options={monthOptions}
          onChange={handleSelect("inicioMes")}
          required
        />
        <TextInput
          id={`inicioAno-${id}`}
          label="Ano de Início *"
          type="number"
          min={1900}
          max={defaultYear}
          value={form.inicioAno.toString()}
          onChange={handleText("inicioAno")}
          required
        />
        <Select
          controlId={`fimMes-${id}`}
          label="Mês de Fim *"
          options={monthOptions}
          onChange={handleSelect("fimMes")}
          required
        />
        <TextInput
          id={`fimAno-${id}`}
          label="Ano de Fim *"
          type="number"
          min={1900}
          max={defaultYear + 10}
          value={form.fimAno.toString()}
          onChange={handleText("fimAno")}
          required
        />
      </div>

      {(onSave || onDelete) && (
        <div className="d-flex justify-content-end gap-2 mt-3">
          {onDelete && (
            <Button variant="danger" onClick={() => onDelete(id)}>
              <BsTrash /> Excluir
            </Button>
          )}
          {onSave && (
            <Button variant="success" onClick={() => onSave(id, form)}>
              Salvar
            </Button>
          )}
        </div>
      )}
    </Form>
  );
}

/* -------------------------------------------------------------------------- */
/*                              LISTA / SECTION                               */
/* -------------------------------------------------------------------------- */

type Edu = EducationData & { id: number | string };

export default function EducationSection({ curriculumId }: EducationSectionProps) {
  const [educations, setEducations] = useState<Edu[]>([]);
  const [loading, setLoading] = useState(true);

  /* load inicial ---------------------------------- */
  useEffect(() => {
    api
      .get(`/escolaridade/list/${curriculumId}`)
      .then(r => {
        const raw = r.data?.data ?? r.data;
        const arr: RawEdu[] = Array.isArray(raw) ? raw : [];
        const normalizado: Edu[] = arr.map(e => ({
          id: e.curriculum_escolaridade_id ?? Date.now(),
          curriculum_curriculum_id: e.curriculum_curriculum_id ?? curriculumId,
          grau: e.grau ?? "",
          descricao: e.descricao ?? "",
          instituicao: e.instituicao ?? "",
          cidade: e.cidade ?? "",
          inicioMes: Number(e.inicioMes ?? 0),
          inicioAno: Number(e.inicioAno ?? defaultYear),
          fimMes: Number(e.fimMes ?? 0),
          fimAno: Number(e.fimAno ?? defaultYear)
        }));
        setEducations(normalizado);
      })
      .finally(() => setLoading(false));
  }, [curriculumId]);

  /* helpers --------------------------------------- */
  const addEmpty = () =>
    setEducations(prev => [
      ...prev,
      {
        id: Date.now(),
        curriculum_curriculum_id: curriculumId,
        grau: "",
        descricao: "",
        instituicao: "",
        cidade: "",
        inicioMes: 0,
        inicioAno: defaultYear,
        fimMes: 0,
        fimAno: defaultYear
      }
    ]);

  const handleChange = (id: Edu["id"], data: Partial<EducationData>) =>
    setEducations(prev => prev.map(e => (e.id === id ? { ...e, ...data } : e)));

  const handleSave = (id: Edu["id"], data: EducationData) => {
    if (typeof id !== "number") {
      api.post("/escolaridade/insert", data).then(r =>
        setEducations(prev => prev.map(e => (e.id === id ? { ...e, id: r.data.id } : e)))
      );
    } else {
      api.put(`/escolaridade/update/${id}`, data);
    }
  };

  const handleDelete = (id: Edu["id"]) => {
    if (typeof id === "number") {
      api.delete(`/escolaridade/delete/${id}`).then(() =>
        setEducations(prev => prev.filter(e => e.id !== id))
      );
    } else {
      setEducations(prev => prev.filter(e => e.id !== id));
    }
  };

  /* render ---------------------------------------- */
  if (loading) return <Spinner animation="border" />;

  return (
    <>
      {educations.map(ed => (
        <EducationItemForm
          key={ed.id}
          id={ed.id}
          initialData={ed}
          onChange={handleChange}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      ))}

      <div className="d-flex justify-content-end mt-3">
        <Button onClick={addEmpty}>+ Adicionar formação</Button>
      </div>
    </>
  );
}
