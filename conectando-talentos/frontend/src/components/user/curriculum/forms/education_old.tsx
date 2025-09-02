import { useEffect, useState } from "react";
import { Button, Form, Spinner, Alert } from "react-bootstrap";
import { BsTrash } from "react-icons/bs";
import api from "@/services/api";
import Select from "@/components/all/select";
import TextInput from "@/components/all/textinput";
import CidadeSelect from "@/components/all/cidadeSelect";

/* ---------- tipos ---------- */
export interface EducationData {
  curriculum_curriculum_id: number;
  grau: string;              // slug (fundamental|medio|...)
  descricao: string;
  instituicao: string;
  cidade_id: number;
  inicioMes: number;
  inicioAno: number;
  fimMes: number;
  fimAno: number;
}
type Edu = EducationData & { id: number | string };

interface RawEdu {
  curriculum_escolaridade_id?: number | string;
  curriculum_curriculum_id?: number | string;
  escolaridade_id?: number | string;
  grau?: string;
  descricao?: string;
  instituicao?: string;
  cidade_id?: number | string;
  inicioMes?: number | string;
  inicioAno?: number | string;
  fimMes?: number | string;
  fimAno?: number | string;
}

interface EducationSectionProps { curriculumId: number; }

const defaultYear = new Date().getFullYear();

const monthOptions = [
  { id: "", displayName: "Selecione" },
  ...["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"].map((m,i)=>({ id: String(i+1), displayName: m }))
];

const grauOptions = [
  { id: "", displayName: "Selecione" },
  { id: "fundamental", displayName: "Ensino Fundamental" },
  { id: "medio",       displayName: "Ensino Médio" },
  { id: "tecnico",     displayName: "Técnico" },
  { id: "graduacao",   displayName: "Graduação" },
  { id: "pos",         displayName: "Pós‑Graduação" },
  { id: "mestrado",    displayName: "Mestrado" },
  { id: "doutorado",   displayName: "Doutorado" }
] as const;

const numericFields: (keyof EducationData)[] = ["cidade_id","inicioMes","inicioAno","fimMes","fimAno"];
const toStr = (v: number | undefined | null) => (v ? String(v) : "");
const toSel = (n: number | undefined | null) => (n && n > 0 ? String(n) : "");

/* ---------- item ---------- */
interface EducationFormProps {
  id: number | string;
  initialData: EducationData;
  canSave: boolean;
  onChange?: (id: number | string, data: Partial<EducationData>) => void;
  onSave?:   (id: number | string, data: EducationData) => void;
  onDelete?: (id: number | string) => void;
}

function EducationItemForm({ id, initialData, canSave, onChange, onSave, onDelete }: EducationFormProps) {
  const [form, setForm] = useState<EducationData>(initialData);

  useEffect(() => { onChange?.(id, form); }, [form]); // notificar pai

  const handleSelect = <K extends keyof EducationData>(field: K) =>
    (value: string) => {
      const v = numericFields.includes(field) && value !== "" ? Number(value) : (value as unknown as EducationData[K]);
      setForm(prev => ({ ...prev, [field]: v }));
    };

  const handleText = <K extends keyof EducationData>(field: K) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.currentTarget.value;
      const v = numericFields.includes(field)
        ? (raw === "" ? ("" as unknown as EducationData[K]) : (Number(raw) as unknown as EducationData[K]))
        : (raw as unknown as EducationData[K]);
      setForm(prev => ({ ...prev, [field]: v }));
    };

  const requiredOk =
    !!form.grau && !!form.descricao && !!form.instituicao &&
    Number(form.cidade_id) > 0 &&
    Number(form.inicioMes) > 0 && Number(form.inicioAno) > 0 &&
    Number(form.fimMes) > 0 && Number(form.fimAno) > 0;

  return (
    <Form className="border rounded-2 mt-3 p-4 shadow-sm bg-body">
      <h3 className="fs-5 fw-bold mb-4">Escolaridade</h3>

      {!canSave && (
        <Alert variant="warning" className="py-2">
          Identificando seu currículo... Você já pode preencher, mas o botão <b>Salvar</b> habilita assim que o sistema obtiver o <i>curriculumId</i>.
        </Alert>
      )}

      <div className="row row-cols-lg-2 g-3">
        <Select
          controlId={`grau-${id}`}
          label="Grau escolar *"
          options={grauOptions}
          value={form.grau}
          onChange={handleSelect("grau")}
          required
        />
        <TextInput
          id={`descricao-${id}`}
          label="Curso / Descrição *"
          placeholder="Análise e Desenvolvimento de Sistemas"
          value={String(form.descricao ?? "")}
          onChange={handleText("descricao")}
          required
        />
      </div>

      <div className="row row-cols-lg-2 g-3 mt-2">
        <TextInput
          id={`instituicao-${id}`}
          label="Instituição *"
          placeholder="Faculdade ..."
          value={String(form.instituicao ?? "")}
          onChange={handleText("instituicao")}
          required
        />
        <CidadeSelect
          controlId={`cidade_id-${id}`}
          label="Cidade *"
          value={form.cidade_id}
          onChange={(cid) => setForm((p) => ({ ...p, cidade_id: cid }))}
          required
        />
      </div>

      <div className="row row-cols-lg-4 g-3 mt-2">
        <Select
          controlId={`inicioMes-${id}`}
          label="Mês de Início *"
          options={monthOptions}
          value={toSel(form.inicioMes)}
          onChange={handleSelect("inicioMes")}
          required
        />
        <TextInput
          id={`inicioAno-${id}`}
          label="Ano de Início *"
          type="number"
          min={1900}
          max={defaultYear}
          value={toStr(Number(form.inicioAno))}
          onChange={handleText("inicioAno")}
          required
        />
        <Select
          controlId={`fimMes-${id}`}
          label="Mês de Fim *"
          options={monthOptions}
          value={toSel(form.fimMes)}
          onChange={handleSelect("fimMes")}
          required
        />
        <TextInput
          id={`fimAno-${id}`}
          label="Ano de Fim *"
          type="number"
          min={1900}
          max={defaultYear + 10}
          value={toStr(Number(form.fimAno))}
          onChange={handleText("fimAno")}
          required
        />
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button variant="danger" onClick={() => onDelete?.(id)}>
          <BsTrash /> Excluir
        </Button>
        <Button
          variant="success"
          onClick={() => onSave?.(id, {
            ...form,
            cidade_id: Number(form.cidade_id),
            inicioMes: Number(form.inicioMes),
            inicioAno: Number(form.inicioAno),
            fimMes: Number(form.fimMes),
            fimAno: Number(form.fimAno),
          })}
          disabled={!requiredOk || !canSave}
        >
          Salvar
        </Button>
      </div>
    </Form>
  );
}

/* ---------- lista/CRUD ---------- */

export default function EducationSection({ curriculumId }: EducationSectionProps) {
  const [educations, setEducations] = useState<Edu[]>([]);
  const [loading, setLoading] = useState(false);

  const addEmpty = () => {
    setEducations((prev) => [
      ...prev,
      {
        id: `tmp_${Date.now()}`,
        curriculum_curriculum_id: Number(curriculumId || 0),
        grau: "",
        descricao: "",
        instituicao: "",
        cidade_id: 0,
        inicioMes: 0,
        inicioAno: defaultYear,
        fimMes: 0,
        fimAno: defaultYear,
      },
    ]);
  };

  useEffect(() => {
    if (!curriculumId) {           // sem id ainda → mostra 1 formulário vazio
      if (educations.length === 0) addEmpty();
      return;
    }

    setLoading(true);
    api
      .get(`/escolaridade/lista/${curriculumId}`, { withCredentials: true })
      .then((r) => {
        const raw: unknown = (r.data && r.data.data) ? r.data.data : r.data;
        const arr: RawEdu[] =
          Array.isArray(raw)
            ? raw
            : [];

        const normalizado: Edu[] = arr.map((e) => ({
          id: Number(e.curriculum_escolaridade_id ?? Date.now()),
          curriculum_curriculum_id: Number(e.curriculum_curriculum_id ?? curriculumId),
          grau: String(e.grau ?? ""),                         // já vem slug do backend
          descricao: String(e.descricao ?? ""),
          instituicao: String(e.instituicao ?? ""),
          cidade_id: Number(e.cidade_id ?? 0),
          inicioMes: Number(e.inicioMes ?? 0),
          inicioAno: Number(e.inicioAno ?? defaultYear),
          fimMes: Number(e.fimMes ?? 0),
          fimAno: Number(e.fimAno ?? defaultYear),
        }));

        setEducations(normalizado.length ? normalizado : []);
        if (normalizado.length === 0) addEmpty();
      })
      .catch((err) => {
        console.error("Falha ao listar escolaridade", err);
        setEducations([]);
        addEmpty();
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curriculumId]);

  const handleChange = (id: Edu["id"], data: Partial<EducationData>) =>
    setEducations((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));

  const handleSave = async (id: Edu["id"], data: EducationData) => {
    if (!curriculumId) return;

    const payload: EducationData = {
      ...data,
      curriculum_curriculum_id: curriculumId,
      cidade_id: Number(data.cidade_id),
      inicioMes: Number(data.inicioMes),
      inicioAno: Number(data.inicioAno),
      fimMes: Number(data.fimMes),
      fimAno: Number(data.fimAno),
    };

    try {
      if (typeof id !== "number") {
        const r = await api.post("/escolaridade/criar", payload, { withCredentials: true });
        const newId = r.data?.data?.curriculum_escolaridade_id;
        if (newId) {
          setEducations((prev) => prev.map((e) => (e.id === id ? { ...e, id: Number(newId) } : e)));
        }
      } else {
        await api.put(`/escolaridade/atualizar/${id}`, payload, { withCredentials: true });
      }
    } catch (err) {
      console.error("Falha ao salvar escolaridade", err);
    }
  };

  const handleDelete = async (id: Edu["id"]) => {
    try {
      if (typeof id === "number") {
        await api.delete(`/escolaridade/remover/${id}`, { withCredentials: true });
        setEducations((prev) => prev.filter((e) => e.id !== id));
      } else {
        setEducations((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error("Falha ao excluir escolaridade", err);
    }
  };

  return (
    <>
      {loading && (
        <div className="d-flex align-items-center gap-2">
          <Spinner animation="border" size="sm" /> <span>Carregando escolaridade...</span>
        </div>
      )}

      {educations.map((ed) => (
        <EducationItemForm
          key={ed.id}
          id={ed.id}
          initialData={ed}
          canSave={!!curriculumId}
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
