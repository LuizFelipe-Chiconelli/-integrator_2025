'use client'

import { useEffect, useMemo, useRef, useState } from "react"
import { Button, Container, FormCheck, Spinner } from "react-bootstrap"
import short, { type SUUID } from "short-uuid"

import api from "@/services/api"
import FormProvider from "@/components/form-kit/context"
import TextField from "@/components/form-kit/fields/text-field"
import TextArea from "@/components/form-kit/fields/text-area"
import SelectField from "@/components/form-kit/fields/select-field"
import type { Option, FieldMethods } from "@/components/form-kit/types"

interface CargoAPI  { cargo_id: number; descricao: string }
interface CidadeAPI { id: number; nome: string; uf: string }

const optionSelecione: Option = { id: "", label: "Selecione" }

const vinculoOptions: Option[] = [
  optionSelecione,
  { id: "1", label: "CLT" },
  { id: "2", label: "PJ" },
  { id: "3", label: "Estágio" },
  { id: "4", label: "Temporário" },
]

const nivelOptions: Option[] = [
  optionSelecione,
  { id: "1", label: "Júnior" },
  { id: "2", label: "Pleno" },
  { id: "3", label: "Sênior" },
  { id: "4", label: "Líder" },
]

// dd/mm/aaaa -> yyyy-mm-dd | yyyy-mm-dd -> mantém | inválido -> ""
function toISODate(s?: string): string {
  const v = String(s || "").trim()
  if (!v) return ""
  const m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (m) {
    const [, dd, mm, yyyy] = m
    return `${yyyy}-${mm}-${dd}`
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v
  return ""
}

export default function VacancyForm() {
  const formId: string = useRef<SUUID>(short().generate()).current.toString()

  const [loading, setLoading]   = useState(true)
  const [busy, setBusy]         = useState(false)
  const [cargos, setCargos]     = useState<CargoAPI[]>([])
  const [cidades, setCidades]   = useState<CidadeAPI[]>([])
  const [isRemote, setIsRemote] = useState(false)

  const cidadeRef = useRef<FieldMethods>(null)

  const cargoOptions: Option[] = useMemo(
    () => [optionSelecione, ...cargos.map(c => ({ id: String(c.cargo_id), label: c.descricao }))],
    [cargos]
  )

  const ufOptions: Option[] = useMemo(() => {
    const ufs = Array.from(new Set(cidades.map(c => c.uf))).sort()
    return [optionSelecione, ...ufs.map(uf => ({ id: uf, label: uf }))]
  }, [cidades])

  const cidadeOptions: Option[] = useMemo(
    () => [optionSelecione, ...cidades.map(c => ({ id: String(c.id), label: c.nome }))],
    [cidades]
  )

  const findCidade = (cidadeIdStr?: string) => {
    const cid = Number(cidadeIdStr || 0)
    return cidades.find(c => c.id === cid)
  }

  useEffect(() => {
    ;(async () => {
      try {
        const { data: dc } = await api.get<{ status: number; cargos: CargoAPI[] }>("/vaga/cargos")
        setCargos(dc?.cargos ?? [])
        const { data: dz } = await api.get<{ status: number; cidades: CidadeAPI[] }>("/cidade/lista")
        setCidades(dz?.cidades ?? [])
      } catch (e) {
        console.error(e)
        alert("Erro ao carregar dados iniciais (cargos/cidades).")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const onSubmit = async (f: Record<string, any>) => {
    const titulo = String(f.titulo || "").trim()
    if (!titulo || titulo.length > 60) {
      alert("Informe o Nome da vaga (até 60 caracteres).")
      return
    }

    // cargo obrigatório
    const cargo_id = Number(f.cargo_id || 0)
    if (!cargo_id) {
      alert("Selecione um cargo do catálogo.")
      return
    }

    const requisitos = String(f.requisitos || "").trim()
    if (!requisitos) { alert("Informe os requisitos."); return }

    const dtFimISO = toISODate(f.dtFim)
    if (!dtFimISO) { alert("Informe uma data de fim válida (DD/MM/AAAA)."); return }

    const modalidade = isRemote ? 2 : 1
    if (!f.vinculo) { alert("Selecione o Tipo de contratação."); return }

    let localizacao = ""
    if (f.cidade_id) {
      const c = findCidade(f.cidade_id)
      const ufFinal = f.uf || c?.uf || ""
      if (c?.nome && ufFinal) localizacao = `${c.nome}, ${ufFinal}`
      else if (c?.nome) localizacao = c.nome
    }

    const payload = {
      titulo,
      descricao: String(f.descricao || "").trim(),
      cargo_id,
      requisitos,
      localizacao,
      salario: String(f.salario || "").trim(),
      nivel: f.nivel ? Number(f.nivel) : 0,
      modalidade,
      vinculo: Number(f.vinculo),
      dtFim: dtFimISO,
      // statusVaga: back define default, estabelecimento_id: sessão
    }

    setBusy(true)
    try {
      await api.post("/vaga/publicar", payload)
      alert("Vaga publicada com sucesso!")
      window.location.reload()
    } catch (e) {
      console.error(e)
      alert("Falha ao publicar a vaga.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Container className="px-0">
      <div className="d-flex align-items-center gap-2 mb-3">
        {(loading || busy) && <Spinner size="sm" animation="border" />}
      </div>

      <FormProvider id={formId} onSubmit={onSubmit}>
        {/* Nome da vaga (titulo) */}
        <TextField
          id={`vaga-titulo-${formId}`}
          name="titulo"
          label="Nome da vaga *"
          placeholder="Ex: Desenvolvedor Full Stack"
          required
        />

        {/* Cargo do catálogo (obrigatório) */}
        <SelectField
          id={`vaga-cargo-${formId}`}
          name="cargo_id"
          label="Cargo (catálogo) *"
          options={cargoOptions}
          required
        />

        {/* Sobre a vaga (texto longo) */}
        <TextArea
          id={`vaga-descricao-${formId}`}
          name="descricao"
          label="Sobre a Vaga"
          placeholder="Descreva responsabilidades, benefícios, stack etc."
        />

        {/* Requisitos (obrigatório) */}
        <TextArea
          id={`vaga-requisitos-${formId}`}
          name="requisitos"
          label="Requisitos *"
          placeholder="Liste os requisitos necessários para a vaga..."
          required
        />

        {/* Vínculo + Localização (UF & Cidade) */}
        <div className="row row-cols-1 row-cols-lg-2 g-3">
          <SelectField
            id={`vaga-vinculo-${formId}`}
            name="vinculo"
            label="Tipo de Contratação *"
            options={vinculoOptions}
            required
          />
          <div className="row row-cols-2 g-3">
            <SelectField id={`vaga-uf-${formId}`} name="uf" label="UF" options={ufOptions} />
            <SelectField
              ref={cidadeRef}
              id={`vaga-cidade-${formId}`}
              name="cidade_id"
              label="Cidade"
              options={cidadeOptions}
            />
          </div>
        </div>

        {/* Salário + Nível */}
        <div className="row row-cols-1 row-cols-lg-2 g-3">
          <TextField
            id={`vaga-sal-${formId}`}
            name="salario"
            label="Faixa Salarial"
            placeholder="Ex: R$ 3.000 - R$ 5.000"
          />
          <SelectField id={`vaga-nivel-${formId}`} name="nivel" label="Nível" options={nivelOptions} />
        </div>

        {/* Modalidade (remoto) + Data fim */}
        <div className="row row-cols-1 row-cols-lg-2 g-3">
          <div className="px-2 d-flex align-items-center">
            <FormCheck
              label="Esta é uma vaga remota"
              checked={isRemote}
              onChange={(e) => setIsRemote(e.target.checked)}
            />
          </div>
          <TextField
            id={`vaga-dtfim-${formId}`}
            name="dtFim"
            label="Data de encerramento *"
            placeholder="DD/MM/AAAA"
            required
          />
        </div>

        <div className="d-flex justify-content-end mt-4">
          <Button type="submit" disabled={busy}>Publicar Vaga</Button>
        </div>
      </FormProvider>
    </Container>
  )
}
