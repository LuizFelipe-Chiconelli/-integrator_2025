import { useEffect, useState, type ChangeEvent } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { BsTrash } from "react-icons/bs";

import api from "@/services/api";
import Select from "@/components/all/select";
import TextInput from "@/components/all/textinput";

/* -------------------------------------------------------------------------- */
/* Tipos                                                                       */
/* -------------------------------------------------------------------------- */

export type Option = { id: string; displayName: string };

export interface ExperienceData {
  curriculum_id: number;        // FK obrigatória
  inicioMes: number;
  inicioAno: number;
  fimMes: number | null;        // pode ser null se emprego atual
  fimAno: number | null;        // pode ser null se emprego atual
  estabelecimento: string;
  cargo_id: number | null;      // catálogo (opcional)
  cargoDescricao: string;       // texto livre (opcional)
  atividadesExercidas: string;  // resumo
}

type Exp = ExperienceData & { id: number | string };

interface RawExp extends Partial<ExperienceData> {
  curriculum_experiencia_id?: number | string;
}

interface ExperienceFormProps {
  curriculumId: number;                // recebido do wrapper (perfil)
  cargoOptions?: Option[];             // recebido do wrapper (cargos do backend)
}

/* -------------------------------------------------------------------------- */
/* constantes                                                                  */
/* -------------------------------------------------------------------------- */

const defaultYear = new Date().getFullYear();

const monthOptions: Option[] = [
  { id: "", displayName: "Selecione" },
  ...["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"].map((m,i)=>({ id: String(i+1), displayName: m }))
];

/** campos numéricos do form */
const numericFields: (keyof ExperienceData)[] = [
  "inicioMes","inicioAno","fimMes","fimAno","cargo_id"
];

/** helpers para value controlado */
const toStr = (v: number | null | undefined) => (v || v === 0 ? String(v ?? "") : "");
const toSel = (n: number | null | undefined) => (n && n > 0 ? String(n) : "");

/* -------------------------------------------------------------------------- */
/* item (formulário)                                                           */
/* -------------------------------------------------------------------------- */

interface ExperienceItemProps {
  id: number | string;
  initialData: ExperienceData;
  canSave: boolean;
  cargoOptions: Option[];
  onChange?: (id: number | string, data: Partial<ExperienceData>) => void;
  onSave?: (id: number | string, data: ExperienceData) => void;
  onDelete?: (id: number | string) => void;
}

function ExperienceItemForm({
  id,
  initialData,
  canSave,
  cargoOptions,
  onChange,
  onSave,
  onDelete
}: ExperienceItemProps) {

  const [form, setForm] = useState<ExperienceData>(initialData);

  // emprego atual = quando fimMes/fimAno são null
  const empregoAtual = form.fimMes === null && form.fimAno === null;

  useEffect(() => { onChange?.(id, form); }, [form, id, onChange]);

  const set = <K extends keyof ExperienceData>(field: K, value: ExperienceData[K]) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSelect = <K extends keyof ExperienceData>(field: K) =>
    (value: string) => {
      const v = numericFields.includes(field)
        ? (value === "" ? (null as unknown as ExperienceData[K]) : (Number(value) as unknown as ExperienceData[K]))
        : (value as unknown as ExperienceData[K]);
      set(field, v);
    };

  const handleText = <K extends keyof ExperienceData>(field: K) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.currentTarget.value;
      const v = numericFields.includes(field)
        ? (raw === "" ? (null as unknown as ExperienceData[K]) : (Number(raw) as unknown as ExperienceData[K]))
        : (raw as unknown as ExperienceData[K]);
      set(field, v);
    };

  const requiredOk =
    Number(form.inicioMes) > 0 &&
    Number(form.inicioAno) > 0 &&
    !!form.estabelecimento &&
    (!!form.cargoDescricao || form.cargo_id !== null);

  return (
    <Form className="border rounded-2 mt-3 p-4 shadow-sm bg-body">
      <h3 className="fs-5 fw-bold mb-4">Experiência</h3>

      {!canSave && (
        <div className="alert alert-warning py-2">
          Identificando seu currículo... Você já pode preencher, mas o botão <b>Salvar</b> será habilitado assim que o sistema obtiver o <i>curriculumId</i>.
        </div>
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

        {/* Catálogo de cargo (opcional) */}
        <Select
          controlId={`cargo_id-${id}`}
          label="Cargo (catálogo)"
          options={cargoOptions.length ? cargoOptions : [{ id: "", displayName: "Selecione" }]}
          value={toSel(form.cargo_id)}
          onChange={(v) => set("cargo_id", v ? Number(v) : null)}
        />
      </div>

      <div className="row row-cols-lg-2 g-3 mt-2">
        {/* Textareas maiores */}
        <Form.Group controlId={`cargoDesc-${id}`} className="mb-3">
          <Form.Label className="fw-semibold mb-1 ms-1" style={{ fontSize: 14 }}>
            Descrição do cargo (texto livre)
          </Form.Label>
        <Form.Control
            as="textarea"
            rows={4}
            placeholder="Desenvolvedor React"
            value={String(form.cargoDescricao ?? "")}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              set("cargoDescricao", e.currentTarget.value)
            }
          />
        </Form.Group>

        <Form.Group controlId={`ativ-${id}`} className="mb-3">
          <Form.Label className="fw-semibold mb-1 ms-1" style={{ fontSize: 14 }}>
            Atividades exercidas (resumo)
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Principais responsabilidades/tecnologias..."
            value={String(form.atividadesExercidas ?? "")}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              set("atividadesExercidas", e.currentTarget.value)
            }
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
          value={toStr(form.inicioAno)}
          onChange={handleText("inicioAno")}
          required
        />
        <Select
          controlId={`fimMes-${id}`}
          label="Mês de Fim"
          options={monthOptions}
          value={empregoAtual ? "" : toSel(form.fimMes)}
          onChange={(v) => set("fimMes", v ? Number(v) : null)}
          disabled={empregoAtual}
        />
        <TextInput
          id={`fimAno-${id}`}
          label="Ano de Fim"
          type="number"
          min={1900}
          max={defaultYear + 10}
          value={empregoAtual ? "" : toStr(form.fimAno ?? 0)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            set("fimAno", empregoAtual ? null : Number(e.currentTarget.value || 0))
          }
          disabled={empregoAtual}
        />
      </div>

      <Form.Check
        className="mt-2"
        type="checkbox"
        label="Emprego atual"
        checked={empregoAtual}
        onChange={() => {
          const novoAtual = !empregoAtual;
          if (novoAtual) {
            set("fimMes", null);
            set("fimAno", null);
          } else {
            // volta placeholders
            set("fimMes", 0 as unknown as number);
            set("fimAno", defaultYear);
          }
        }}
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
            fimMes: empregoAtual ? null : (form.fimMes ? Number(form.fimMes) : null),
            fimAno: empregoAtual ? null : (form.fimAno ? Number(form.fimAno) : null),
            cargo_id: form.cargo_id ? Number(form.cargo_id) : null
          })}
          disabled={!canSave || !requiredOk}
        >
          Salvar
        </Button>
      </div>
    </Form>
  );
}

/* -------------------------------------------------------------------------- */
/* section/lista (CRUD)                                                        */
/* -------------------------------------------------------------------------- */

export default function ExperienceFormWrapper({ curriculumId, cargoOptions = [{ id: "", displayName: "Selecione" }] }: ExperienceFormProps) {
  const [experiences, setExperiences] = useState<Exp[]>([]);
  const [loading, setLoading] = useState(false);

  const addEmpty = (): Exp => ({
    id: `tmp_${Date.now()}`,
    curriculum_id: Number(curriculumId || 0),
    inicioMes: 0,
    inicioAno: defaultYear,
    fimMes: 0,
    fimAno: defaultYear,
    estabelecimento: "",
    cargo_id: null,
    cargoDescricao: "",
    atividadesExercidas: ""
  });

  useEffect(() => {
    if (!curriculumId) {
      if (experiences.length === 0) setExperiences([addEmpty()]);
      return;
    }

    setLoading(true);
    api
      .get(`/experiencia/lista/${curriculumId}`, { withCredentials: true })
      .then((r) => {
        const raw = r.data?.data ?? r.data;
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

        setExperiences(normalizado.length ? normalizado : [addEmpty()]);
      })
      .catch((err) => {
        console.error("Falha ao listar experiências", err);
        setExperiences([addEmpty()]);
      })
      .finally(() => setLoading(false));
  }, [curriculumId]); // ok

  const handleChange = (id: Exp["id"], data: Partial<ExperienceData>) =>
    setExperiences(prev => prev.map(e => (e.id === id ? { ...e, ...data } : e)));

  const handleSave = async (id: Exp["id"], data: ExperienceData) => {
    if (!curriculumId) return;

    const payload: ExperienceData = {
      ...data,
      curriculum_id: curriculumId,
      inicioMes: Number(data.inicioMes),
      inicioAno: Number(data.inicioAno),
      fimMes: data.fimMes === null ? null : Number(data.fimMes),
      fimAno: data.fimAno === null ? null : Number(data.fimAno),
      cargo_id: data.cargo_id === null ? null : Number(data.cargo_id)
    };

    try {
      if (typeof id !== "number") {
        const r = await api.post("/experiencia/criar", payload, { withCredentials: true });
        const newId = r.data?.data?.curriculum_experiencia_id ?? r.data?.id ?? r.data?.data?.id;
        if (newId) {
          setExperiences(prev => prev.map(e => (e.id === id ? { ...e, id: Number(newId) } : e)));
        }
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
        setExperiences(prev => prev.filter(e => e.id !== id));
      } else {
        setExperiences(prev => prev.filter(e => e.id !== id));
      }
    } catch (err) {
      console.error("Falha ao excluir experiência", err);
    }
  };

  return (
    <>
      {loading && (
        <div className="d-flex align-items-center gap-2">
          <Spinner animation="border" size="sm" /> <span>Carregando experiências...</span>
        </div>
      )}

      {experiences.map((ex) => (
        <ExperienceItemForm
          key={ex.id}
          id={ex.id}
          initialData={ex}
          canSave={!!curriculumId}
          cargoOptions={cargoOptions}
          onChange={handleChange}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      ))}

      <div className="d-flex justify-content-end mt-3">
        <Button onClick={() => setExperiences(prev => [...prev, addEmpty()])}>+ Adicionar experiência</Button>
      </div>
    </>
  );
}
