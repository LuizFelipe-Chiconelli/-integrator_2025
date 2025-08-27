import { useEffect, useState, type ChangeEvent } from "react";
import { Button, Form, Spinner, Alert } from "react-bootstrap";
import { BsTrash } from "react-icons/bs";
import api from "@/services/api";
import Select from "@/components/all/select";
import TextInput from "@/components/all/textinput";

/* ---------- tipos ---------- */
export interface ExperienceData {
  curriculum_id: number;
  inicioMes: number;
  inicioAno: number;
  fimMes: number | null;
  fimAno: number | null;
  estabelecimento: string;
  cargo_id: number | null;
  cargoDescricao: string;
  atividadesExercidas: string;
}
type Exp = ExperienceData & { id: number | string };

interface RawExp {
  curriculum_experiencia_id?: number | string;
  curriculum_id?: number | string;
  inicioMes?: number | string | null;
  inicioAno?: number | string | null;
  fimMes?: number | string | null;
  fimAno?: number | string | null;
  estabelecimento?: string;
  cargo_id?: number | string | null;
  cargoDescricao?: string;
  atividadesExercidas?: string;
}

interface ExperienceFormProps {
  id: number | string;
  initialData: ExperienceData;
  canSave: boolean;
  onChange?: (id: number | string, data: Partial<ExperienceData>) => void;
  onSave?:   (id: number | string, data: ExperienceData) => void;
  onDelete?: (id: number | string) => void;
}

/* ---------- constantes ---------- */
const defaultYear = new Date().getFullYear();

const monthOptions = [
  { id: "", displayName: "Selecione" },
  ...["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"].map((m,i)=>({ id: String(i+1), displayName: m }))
];

const numericFields: (keyof ExperienceData)[] = ["inicioMes","inicioAno","fimMes","fimAno","cargo_id"];
const toStr = (v: number | undefined | null) => (v ? String(v) : "");
const toSel = (n: number | undefined | null) => (n && n > 0 ? String(n) : "");

/* ---------- item ---------- */
function ExperienceItemForm({ id, initialData, canSave, onChange, onSave, onDelete }: ExperienceFormProps) {
  const [form, setForm] = useState<ExperienceData>(initialData);

  const empregoAtual = form.fimMes === null && form.fimAno === null;

  useEffect(() => { onChange?.(id, form); }, [form]);

  const handleSelect = <K extends keyof ExperienceData>(field: K) =>
    (value: string) => {
      const v = numericFields.includes(field) && value !== "" ? Number(value) : (value as unknown as ExperienceData[K]);
      setForm(prev => ({ ...prev, [field]: v }));
    };

  const handleText = <K extends keyof ExperienceData>(field: K) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const raw = e.currentTarget.value;
      const v = numericFields.includes(field)
        ? (raw === "" ? (null as unknown as ExperienceData[K]) : (Number(raw) as unknown as ExperienceData[K]))
        : (raw as unknown as ExperienceData[K]);
      setForm(prev => ({ ...prev, [field]: v }));
    };

  const requiredOk =
    Number(form.inicioMes) > 0 && Number(form.inicioAno) > 0 &&
    !!form.estabelecimento && (!!form.cargoDescricao || form.cargo_id !== null);

  return (
    <Form className="border rounded-2 mt-3 p-4 shadow-sm bg-body">
      <h3 className="fs-5 fw-bold mb-4">Experiência</h3>

      {!canSave && (
        <Alert variant="warning" className="py-2">
          Identificando seu currículo... O botão <b>Salvar</b> só habilita quando houver <i>curriculumId</i>.
        </Alert>
      )}

      <div className="row row-cols-lg-2 g-3">
        <TextInput
          id={`estab-${id}`}
          label="Empresa / Estabelecimento *"
          placeholder="Tech Company"
          value={String(form.estabelecimento ?? "")}
          onChange={handleText("estabelecimento")}
          required
        />
        <TextInput
          id={`cargoDesc-${id}`}
          label="Cargo ou descrição livre"
          placeholder="Desenvolvedor React"
          value={String(form.cargoDescricao ?? "")}
          onChange={handleText("cargoDescricao")}
        />
      </div>

      <div className="row g-3 mt-2">
        <Form.Group controlId={`ativ-${id}`}>
          <Form.Label>Atividades exercidas</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Principais responsabilidades / tecnologias"
            value={String(form.atividadesExercidas ?? "")}
            onChange={handleText("atividadesExercidas")}
          />
        </Form.Group>
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
          label="Mês de Fim"
          options={monthOptions}
          value={empregoAtual ? "" : toSel(form.fimMes)}
          onChange={handleSelect("fimMes")}
          disabled={empregoAtual}
        />
        <TextInput
          id={`fimAno-${id}`}
          label="Ano de Fim"
          type="number"
          min={1900}
          max={defaultYear + 10}
          value={empregoAtual ? "" : toStr(Number(form.fimAno))}
          onChange={handleText("fimAno")}
          disabled={empregoAtual}
        />
      </div>

      <Form.Check
        className="mt-2"
        type="checkbox"
        label="Emprego atual"
        checked={empregoAtual}
        onChange={() => setForm(prev => ({
          ...prev,
          fimMes: empregoAtual ? 0 : null,
          fimAno: empregoAtual ? defaultYear : null
        }))}
      />

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button variant="danger" onClick={() => onDelete?.(id)}>
          <BsTrash /> Excluir
        </Button>
        <Button
          variant="success"
          onClick={() => onSave?.(id, {
            ...form,
            inicioMes: Number(form.inicioMes),
            inicioAno: Number(form.inicioAno),
            fimMes: empregoAtual ? null : Number(form.fimMes),
            fimAno: empregoAtual ? null : Number(form.fimAno),
            cargo_id: form.cargo_id ? Number(form.cargo_id) : null
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
export default function ExperienceForm({ curriculumId }: { curriculumId: number }) {
  const [items, setItems] = useState<Exp[]>([]);
  const [loading, setLoading] = useState(false);

  const addEmpty = () => {
    setItems(prev => [
      ...prev,
      {
        id: `tmp_${Date.now()}`,
        curriculum_id: curriculumId,
        inicioMes: 0,
        inicioAno: defaultYear,
        fimMes: null,
        fimAno: null,
        estabelecimento: "",
        cargo_id: null,
        cargoDescricao: "",
        atividadesExercidas: ""
      }
    ]);
  };

  useEffect(() => {
    if (!curriculumId) { if (items.length === 0) addEmpty(); return; }

    setLoading(true);
    api.get(`/experiencia/lista/${curriculumId}`, { withCredentials: true })
      .then(r => {
        const raw: unknown = r.data?.data ?? r.data;
        const arr: RawExp[] = Array.isArray(raw) ? raw : [];

        const normalizado: Exp[] = arr.map(e => ({
          id: Number(e.curriculum_experiencia_id ?? Date.now()),
          curriculum_id: Number(e.curriculum_id ?? curriculumId),
          inicioMes: Number(e.inicioMes ?? 0),
          inicioAno: Number(e.inicioAno ?? defaultYear),
          fimMes: e.fimMes === null ? null : Number(e.fimMes ?? 0),
          fimAno: e.fimAno === null ? null : Number(e.fimAno ?? defaultYear),
          estabelecimento: e.estabelecimento ?? "",
          cargo_id: e.cargo_id === null ? null : Number(e.cargo_id ?? 0),
          cargoDescricao: e.cargoDescricao ?? "",
          atividadesExercidas: e.atividadesExercidas ?? ""
        }));

        setItems(normalizado.length ? normalizado : []);
        if (!normalizado.length) addEmpty();
      })
      .catch(err => { console.error("Falha ao listar experiências", err); addEmpty(); })
      .finally(() => setLoading(false));
  }, [curriculumId]);

  const handleChange = (id: Exp["id"], data: Partial<ExperienceData>) =>
    setItems(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));

  const handleSave = async (id: Exp["id"], data: ExperienceData) => {
    if (!curriculumId) return;
    const payload = { ...data, curriculum_id: curriculumId };

    try {
      if (typeof id !== "number") {
        const r = await api.post("/experiencia/criar", payload, { withCredentials: true });
        const newId = r.data?.data?.curriculum_experiencia_id;
        if (newId) setItems(prev => prev.map(e => e.id === id ? { ...e, id: Number(newId) } : e));
      } else {
        await api.put(`/experiencia/atualizar/${id}`, payload, { withCredentials: true });
      }
    } catch (err) {
      console.error("Falha ao salvar experiência", err);
    }
  };

  const handleDelete = async (id: Exp["id"]) => {
    try {
      if (typeof id === "number") {
        await api.delete(`/experiencia/excluir/${id}`, { withCredentials: true });
        setItems(prev => prev.filter(e => e.id !== id));
      } else {
        setItems(prev => prev.filter(e => e.id !== id));
      }
    } catch (err) {
      console.error("Falha ao excluir experiência", err);
    }
  };

  return (
    <>
      {loading && <div className="d-flex align-items-center gap-2"><Spinner size="sm" animation="border" /> <span>Carregando experiências...</span></div>}
      {items.map(e => (
        <ExperienceItemForm
          key={e.id}
          id={e.id}
          initialData={e}
          canSave={!!curriculumId}
          onChange={handleChange}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      ))}
      <div className="d-flex justify-content-end mt-3">
        <Button onClick={addEmpty}>+ Adicionar experiência</Button>
      </div>
    </>
  );
}
