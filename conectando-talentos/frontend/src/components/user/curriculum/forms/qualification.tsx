import { useEffect, useState, type ChangeEvent } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { BsTrash } from "react-icons/bs";
import api from "@/services/api";
import Select from "@/components/all/select";
import TextInput from "@/components/all/textinput";

/* ----------------------------- Tipos ----------------------------- */

export interface QualificationData {
  curriculum_id: number;       // FK
  mes: number;                 // 1-12
  ano: number;                 // >= 1900
  cargaHoraria: number;        // horas
  descricao: string;           // nome/descrição do curso
  estabelecimento: string;     // instituição
}
type Quali = QualificationData & { id: number | string };

interface RawQuali extends Partial<QualificationData> {
  curriculum_qualificacao_id?: number | string;
}

interface QualificationSectionProps {
  curriculumId: number;
}

/* -------------------------- Constantes --------------------------- */

const defaultYear = new Date().getFullYear();

const monthOptions = [
  { id: "", displayName: "Selecione" },
  ...["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]
    .map((m,i)=>({ id: String(i+1), displayName: m }))
];

const numericFields: (keyof QualificationData)[] = [
  "mes","ano","cargaHoraria"
];

const toStr = (v: number | null | undefined) => (v || v === 0 ? String(v ?? "") : "");
const toSel = (n: number | null | undefined) => (n && n > 0 ? String(n) : "");

/* ----------------------- Item (formulário) ---------------------- */

interface QualificationItemProps {
  id: number | string;
  initialData: QualificationData;
  canSave: boolean;
  onChange?: (id: number | string, data: Partial<QualificationData>) => void;
  onSave?: (id: number | string, data: QualificationData) => void;
  onDelete?: (id: number | string) => void;
}

function QualificationItemForm({
  id,
  initialData,
  canSave,
  onChange,
  onSave,
  onDelete
}: QualificationItemProps) {

  const [form, setForm] = useState<QualificationData>(initialData);

  useEffect(() => { onChange?.(id, form); /* eslint-disable-next-line */ }, [form]);

  const setField = <K extends keyof QualificationData>(field: K, value: QualificationData[K]) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSelect = <K extends keyof QualificationData>(field: K) =>
    (value: string) => {
      const v = numericFields.includes(field)
        ? (value === "" ? (0 as unknown as QualificationData[K]) : (Number(value) as unknown as QualificationData[K]))
        : (value as unknown as QualificationData[K]);
      setField(field, v);
    };

  const handleText = <K extends keyof QualificationData>(field: K) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.currentTarget.value;
      const v = numericFields.includes(field)
        ? (raw === "" ? (0 as unknown as QualificationData[K]) : (Number(raw) as unknown as QualificationData[K]))
        : (raw as unknown as QualificationData[K]);
      setField(field, v);
    };

  const requiredOk =
    !!form.descricao &&
    !!form.estabelecimento &&
    Number(form.cargaHoraria) > 0 &&
    Number(form.mes) > 0 &&
    Number(form.ano) >= 1900;

  return (
    <Form className="border rounded-2 mt-3 p-4 shadow-sm bg-body">
      <h3 className="fs-5 fw-bold mb-4">Curso</h3>

      {!canSave && (
        <div className="alert alert-warning py-2">
          Identificando seu currículo... Você já pode preencher, mas o botão <b>Salvar</b> será habilitado assim que o sistema obtiver o <i>curriculumId</i>.
        </div>
      )}

      <div className="row row-cols-lg-2 g-3">
        <TextInput
          id={`desc-${id}`}
          label="Nome/descrição do curso *"
          placeholder="React Avançado"
          value={String(form.descricao ?? "")}
          onChange={handleText("descricao")}
          required
        />
        <TextInput
          id={`inst-${id}`}
          label="Instituição *"
          placeholder="Tech Academy"
          value={String(form.estabelecimento ?? "")}
          onChange={handleText("estabelecimento")}
          required
        />
      </div>

      <div className="row row-cols-lg-3 g-3 mt-2">
        <TextInput
          id={`carga-${id}`}
          label="Carga horária (h) *"
          type="number"
          min={1}
          max={10000}
          value={toStr(form.cargaHoraria)}
          onChange={handleText("cargaHoraria")}
          required
        />
        <Select
          controlId={`mes-${id}`}
          label="Mês de conclusão *"
          options={monthOptions}
          value={toSel(form.mes)}
          onChange={handleSelect("mes")}
          required
        />
        <TextInput
          id={`ano-${id}`}
          label="Ano de conclusão *"
          type="number"
          min={1900}
          max={defaultYear + 10}
          value={toStr(form.ano)}
          onChange={handleText("ano")}
          required
        />
      </div>

      {/* Botões lado a lado */}
      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button
          className="d-flex align-items-center gap-1"
          variant="danger"
          onClick={() => onDelete?.(id)}
        >
          <BsTrash /> Excluir
        </Button>

        <Button
          className="d-flex align-items-center gap-1"
          variant="success"
          onClick={() => onSave?.(id, {
            ...form,
            mes: Number(form.mes),
            ano: Number(form.ano),
            cargaHoraria: Number(form.cargaHoraria),
          })}
          disabled={!canSave || !requiredOk}
        >
          Salvar
        </Button>
      </div>
    </Form>
  );
}

/* ----------------------- Lista/CRUD (section) ---------------------- */

export default function QualificationForm({ curriculumId }: QualificationSectionProps) {
  const [items, setItems] = useState<Quali[]>([]);
  const [loading, setLoading] = useState(false);

  const addEmpty = (): Quali => ({
    id: `tmp_${Date.now()}`,
    curriculum_id: Number(curriculumId || 0),
    mes: 0,
    ano: defaultYear,
    cargaHoraria: 0,
    descricao: "",
    estabelecimento: ""
  });

  useEffect(() => {
    if (!curriculumId) {
      if (items.length === 0) setItems([addEmpty()]);
      return;
    }

    setLoading(true);
    api
      .get(`/qualificacao/lista/${curriculumId}`, { withCredentials: true })
      .then((r) => {
        const raw = r.data?.data ?? r.data;
        const arr: RawQuali[] = Array.isArray(raw) ? raw : [];

        const normalizado: Quali[] = arr.map((e) => ({
          id: Number(e.curriculum_qualificacao_id ?? Date.now()),
          curriculum_id: Number(e.curriculum_id ?? curriculumId),
          mes: Number(e.mes ?? 0),
          ano: Number(e.ano ?? defaultYear),
          cargaHoraria: Number(e.cargaHoraria ?? 0),
          descricao: e.descricao ?? "",
          estabelecimento: e.estabelecimento ?? ""
        }));

        setItems(normalizado.length ? normalizado : [addEmpty()]);
      })
      .catch((err) => {
        console.error("Falha ao listar qualificações", err);
        setItems([addEmpty()]);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curriculumId]);

  const handleChange = (id: Quali["id"], data: Partial<QualificationData>) =>
    setItems((prev) => prev.map((q) => (q.id === id ? { ...q, ...data } : q)));

  const handleSave = async (id: Quali["id"], data: QualificationData) => {
    if (!curriculumId) return;

    const payload: QualificationData = {
      ...data,
      curriculum_id: curriculumId,
      mes: Number(data.mes),
      ano: Number(data.ano),
      cargaHoraria: Number(data.cargaHoraria)
    };

    try {
      if (typeof id !== "number") {
        const r = await api.post("/qualificacao/criar", payload, { withCredentials: true });
        const newId =
          r.data?.data?.curriculum_qualificacao_id ??
          r.data?.id ?? r.data?.data?.id;

        if (newId) {
          setItems((prev) =>
            prev.map((q) => (q.id === id ? { ...q, id: Number(newId) } : q))
          );
        }
      } else {
        await api.put(`/qualificacao/atualizar/${id}`, payload, { withCredentials: true });
      }
    } catch (err) {
      console.error("Falha ao salvar qualificação", err);
    }
  };

  const handleDelete = async (id: Quali["id"]) => {
    try {
      if (typeof id === "number") {
        await api.delete(`/qualificacao/excluir/${id}`, { withCredentials: true });
        setItems((prev) => prev.filter((q) => q.id !== id));
      } else {
        setItems((prev) => prev.filter((q) => q.id !== id));
      }
    } catch (err) {
      console.error("Falha ao excluir qualificação", err);
    }
  };

  return (
    <>
      {loading && (
        <div className="d-flex align-items-center gap-2">
          <Spinner animation="border" size="sm" /> <span>Carregando qualificações...</span>
        </div>
      )}

      {items.map((q) => (
        <QualificationItemForm
          key={q.id}
          id={q.id}
          initialData={q}
          canSave={!!curriculumId}
          onChange={handleChange}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      ))}

      <div className="d-flex justify-content-end mt-3">
        <Button onClick={() => setItems((prev) => [...prev, addEmpty()])}>
          + Adicionar curso
        </Button>
      </div>
    </>
  );
}
