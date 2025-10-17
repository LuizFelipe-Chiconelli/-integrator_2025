"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Modal, Button, Spinner, Row, Col } from "react-bootstrap";
import short, { type SUUID } from "short-uuid";

import api from "@/services/api";
import FormProvider from "@/components/form-kit/context";
import TextField from "@/components/form-kit/fields/text-field";
import TextArea from "@/components/form-kit/fields/text-area";
import SelectField from "@/components/form-kit/fields/select-field";
import type { Option } from "@/components/form-kit/types";

type ManageJobModalProps = {
  open: boolean;
  vagaId: number | null;
  onClose: () => void;
  onSaved?: () => void;   // recarregar lista
  onDeleted?: () => void; // recarregar lista
};

type VagaAPI = {
  vaga_id: number;
  titulo: string | null;
  cargo_id: number | null;
  cargo_descricao?: string | null;
  /** compat: o back pode devolver `descricao` (novo) ou `sobreaVaga` (legado) */
  descricao?: string | null;
  sobreaVaga?: string | null;
  requisitos?: string | null;
  localizacao?: string | null;
  salario?: string | null;
  nivel?: number | null;        // 1..4
  modalidade: number;           // 1 presencial / 2 remoto
  vinculo: number;              // 1 clt / 2 pj / ...
  dtFim: string;                // yyyy-mm-dd
  statusVaga: number;           // 11..14
};

const optionSelecione: Option = { id: "", label: "Selecione" };
const vinculoOptions: Option[] = [
  optionSelecione,
  { id: "1", label: "CLT" },
  { id: "2", label: "PJ" },
  { id: "3", label: "Estágio" },
  { id: "4", label: "Temporário" },
];
const modalidadeOptions: Option[] = [
  optionSelecione,
  { id: "1", label: "Presencial" },
  { id: "2", label: "Remoto" },
];
const nivelOptions: Option[] = [
  optionSelecione,
  { id: "1", label: "Júnior" },
  { id: "2", label: "Pleno" },
  { id: "3", label: "Sênior" },
  { id: "4", label: "Líder" },
];
const statusOptions: Option[] = [
  { id: "11", label: "Em aberto" },
  { id: "12", label: "Pausada" },
  { id: "13", label: "Fechada" },
  { id: "14", label: "Cancelada" },
];

export default function ManageJobModal({
  open,
  vagaId,
  onClose,
  onSaved,
  onDeleted,
}: ManageJobModalProps) {
  const formId: string = useRef<SUUID>(short().generate()).current.toString();

  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vaga, setVaga] = useState<VagaAPI | null>(null);
  const [cargos, setCargos] = useState<Array<{ cargo_id: number; descricao: string }>>([]);

  const cargoOptions: Option[] = useMemo(
    () => [optionSelecione, ...cargos.map(c => ({ id: String(c.cargo_id), label: c.descricao }))],
    [cargos]
  );

  // carrega detalhes + catálogo de cargos quando abre
  useEffect(() => {
    if (!open || !vagaId) return;
    (async () => {
      try {
        setLoading(true);
        const [det, cat] = await Promise.all([
          api.get<{ status: number; data: VagaAPI }>(`/vaga/detalhe/${vagaId}`),
          api.get<{ status: number; cargos: { cargo_id: number; descricao: string }[] }>(`/vaga/cargos`),
        ]);
        setVaga(det.data.data);
        setCargos(cat.data.cargos ?? []);
      } catch (e) {
        console.error(e);
        alert("Falha ao carregar a vaga.");
        onClose();
      } finally {
        setLoading(false);
      }
    })();
  }, [open, vagaId, onClose]);

  // salvar (PUT /vaga/atualizar/{id})
  const onSubmit = async (f: Record<string, any>) => {
    if (!vagaId) return;
    // valida mínimos no front
    if (!f.titulo || !f.vinculo || !f.modalidade || !f.dtFim) {
      alert("Preencha título, vínculo, modalidade e data final.");
      return;
    }

    // IMPORTANTE:
    // O backend espera "descricao" (texto longo). Mantemos compat
    // montando "descricao" a partir do campo do form "sobreVaga".
    const payload = {
      titulo: String(f.titulo).trim(),
      cargo_id: f.cargo_id ? Number(f.cargo_id) : 0, // 0 = sem cargo do catálogo
      descricao: String(f.sobreVaga || "").trim(),    // <— aqui trocamos
      requisitos: String(f.requisitos || "").trim(),
      localizacao: String(f.localizacao || "").trim(),
      salario: String(f.salario || "").trim(),
      nivel: f.nivel ? Number(f.nivel) : 0,
      modalidade: Number(f.modalidade),
      vinculo: Number(f.vinculo),
      dtFim: String(f.dtFim).trim(), // yyyy-mm-dd
    };

    setBusy(true);
    try {
      await api.put(`/vaga/atualizar/${vagaId}`, payload);
      alert("Vaga atualizada!");
      onSaved?.();
      onClose();
    } catch (e) {
      console.error(e);
      alert("Falha ao atualizar a vaga.");
    } finally {
      setBusy(false);
    }
  };

  // mudar status (POST /vaga/status/{id}) — usamos POST por causa do CORS
  const handleStatus = async (novo: number) => {
    if (!vagaId) return;
    setBusy(true);
    try {
      const resp = await api.post(`/vaga/status/${vagaId}`, { statusVaga: novo });
      if (resp?.data?.status !== 200) {
        throw new Error(resp?.data?.mensagem || "Falha ao atualizar status");
      }
      alert("Status atualizado!");
      onSaved?.();
      // reflete no modal sem fechar
      setVaga(v => (v ? { ...v, statusVaga: novo } : v));
    } catch (e) {
      console.error(e);
      alert("Falha ao atualizar status.");
    } finally {
      setBusy(false);
    }
  };

  // excluir (DELETE /vaga/remover/{id})
  const handleDelete = async () => {
    if (!vagaId) return;
    if (!confirm("Tem certeza que deseja excluir esta vaga?")) return;

    setBusy(true);
    try {
      await api.delete(`/vaga/remover/${vagaId}`);
      alert("Vaga excluída!");
      onDeleted?.();
      onClose();
    } catch (e) {
      console.error(e);
      alert("Falha ao excluir a vaga.");
    } finally {
      setBusy(false);
    }
  };

  // helper para carregar a descrição correta (descricao | sobreaVaga)
  const initialDescricao =
    (vaga?.descricao ?? vaga?.sobreaVaga ?? "") || "";

  return (
    <Modal show={open} onHide={onClose} centered size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Gerenciar vaga</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading || !vaga ? (
          <div className="d-flex align-items-center gap-2">
            <Spinner size="sm" animation="border" /> Carregando…
          </div>
        ) : (
          <FormProvider id={formId} onSubmit={onSubmit}>
            <Row className="g-3">
              <Col lg={8}>
                <TextField
                  id={`titulo-${formId}`}
                  name="titulo"
                  label="Título *"
                  initialValue={vaga.titulo || ""}
                  required
                />
              </Col>

              <Col lg={4}>
                <SelectField
                  id={`cargo-${formId}`}
                  name="cargo_id"
                  label="Cargo (catálogo)"
                  options={cargoOptions}
                  initialValue={vaga.cargo_id ? String(vaga.cargo_id) : ""}
                />
              </Col>

              <Col lg={12}>
                <TextArea
                  id={`sobre-${formId}`}
                  name="sobreVaga"
                  label="Sobre a vaga"
                  initialValue={initialDescricao}
                />
              </Col>

              <Col lg={12}>
                <TextArea
                  id={`req-${formId}`}
                  name="requisitos"
                  label="Requisitos *"
                  required
                  initialValue={vaga.requisitos || ""}
                />
              </Col>

              <Col lg={6}>
                <TextField
                  id={`local-${formId}`}
                  name="localizacao"
                  label="Localização"
                  placeholder="Ex: Juiz de Fora, MG"
                  initialValue={vaga.localizacao || ""}
                />
              </Col>

              <Col lg={3}>
                <TextField
                  id={`sal-${formId}`}
                  name="salario"
                  label="Salário"
                  placeholder="Ex: R$ 5.000"
                  initialValue={vaga.salario || ""}
                />
              </Col>

              <Col lg={3}>
                <SelectField
                  id={`nivel-${formId}`}
                  name="nivel"
                  label="Nível"
                  options={nivelOptions}
                  initialValue={vaga.nivel ? String(vaga.nivel) : ""}
                />
              </Col>

              <Col lg={4}>
                <SelectField
                  id={`mod-${formId}`}
                  name="modalidade"
                  label="Modalidade *"
                  options={modalidadeOptions}
                  required
                  initialValue={String(vaga.modalidade)}
                />
              </Col>

              <Col lg={4}>
                <SelectField
                  id={`vin-${formId}`}
                  name="vinculo"
                  label="Vínculo *"
                  options={vinculoOptions}
                  required
                  initialValue={String(vaga.vinculo)}
                />
              </Col>

              <Col lg={4}>
                <TextField
                  id={`fim-${formId}`}
                  name="dtFim"
                  label="Data de encerramento *"
                  type="date"
                  required
                  initialValue={vaga.dtFim || ""}
                />
              </Col>
            </Row>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="d-flex gap-2">
                {statusOptions.map(s => (
                  <Button
                    key={s.id}
                    variant={vaga.statusVaga === Number(s.id) ? "primary" : "outline-primary"}
                    size="sm"
                    disabled={busy}
                    onClick={() => handleStatus(Number(s.id))}
                  >
                    {s.label}
                  </Button>
                ))}
              </div>

              <div className="d-flex gap-2">
                <Button variant="danger" onClick={handleDelete} disabled={busy}>
                  Excluir
                </Button>
                <Button type="submit" disabled={busy}>
                  {busy ? "Salvando…" : "Salvar alterações"}
                </Button>
              </div>
            </div>
          </FormProvider>
        )}
      </Modal.Body>
    </Modal>
  );
}
