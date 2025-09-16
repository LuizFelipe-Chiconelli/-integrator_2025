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

interface CargoAPI { cargo_id: number; descricao: string }
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

export default function VacancyForm() {
  const formId: string = useRef<SUUID>(short().generate()).current.toString()

  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [cargos, setCargos] = useState<CargoAPI[]>([])
  const [cidades, setCidades] = useState<CidadeAPI[]>([])
  const [isRemote, setIsRemote] = useState(false)

  // refs para limpar cidade se quisermos no futuro
  const cidadeRef = useRef<FieldMethods>(null)

  const cargoOptions: Option[] = useMemo(
    () => [optionSelecione, ...cargos.map(c => ({ id: String(c.cargo_id), label: c.descricao }))],
    [cargos]
  )

  // UFs únicas
  const ufOptions: Option[] = useMemo(() => {
    const ufs = Array.from(new Set(cidades.map(c => c.uf))).sort()
    return [optionSelecione, ...ufs.map(uf => ({ id: uf, label: uf }))]
  }, [cidades])

  // Todas as cidades (sem filtro por UF, para não depender de onChange no FormKit)
  const cidadeOptions: Option[] = useMemo(
    () => [optionSelecione, ...cidades.map(c => ({ id: String(c.id), label: c.nome }))],
    [cidades]
  )

  // helper: achar cidade e uf pela cidade_id
  const findCidade = (cidadeIdStr?: string) => {
    const cid = Number(cidadeIdStr || 0)
    return cidades.find(c => c.id === cid)
  }

  useEffect(() => {
    ;(async () => {
      try {
        // cargos
        const { data: dc } = await api.get<{ status: number; cargos: CargoAPI[] }>("/vaga/cargos")
        setCargos(dc?.cargos ?? [])

        // cidades
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
    if (!f.descricao || !f.vagaTipo || !f.cargo_id) {
      alert("Preencha: Nome da vaga, Cargo (catálogo) e Tipo de contratação.")
      return
    }
    if (String(f.descricao).trim().length > 60) {
      alert("O nome da vaga deve ter no máximo 60 caracteres.")
      return
    }

    // Monta “Localização: Cidade, UF” a partir dos selects, se houver
    let localizacao = ""
    if (f.cidade_id) {
      const c = findCidade(f.cidade_id)
      const ufFinal = f.uf || c?.uf || ""
      if (c?.nome && ufFinal) localizacao = `${c.nome}, ${ufFinal}`
      else if (c?.nome) localizacao = c.nome
    }

    const nivelTxt = nivelOptions.find(o => o.id === String(f.vagaExp))?.label || ""
    const extras: string[] = []
    if (f.vagaRequisitos) extras.push(`Requisitos:\n${String(f.vagaRequisitos).trim()}`)
    if (localizacao)     extras.push(`Localização: ${localizacao}`)
    if (f.vagaSalario)   extras.push(`Faixa Salarial: ${String(f.vagaSalario).trim()}`)
    if (nivelTxt)        extras.push(`Nível: ${nivelTxt}`)

    const sobreVagaFinal = [String(f.vagaDesc || "").trim(), ...extras].filter(Boolean).join("\n\n")

    const payload = {
      cargo_id: Number(f.cargo_id),
      descricao: String(f.descricao).trim(),
      sobreVaga: sobreVagaFinal,     // back mapeia para 'sobreaVaga'
      modalidade: isRemote ? 2 : 1,  // 1=presencial, 2=remoto
      vinculo: Number(f.vagaTipo),
      // statusVaga default no back (11)
      // estabelecimento_id vem da Session no backend
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
        <TextField
          id={`vaga-nome-${formId}`}
          name="descricao"
          label="Nome da vaga *"
          placeholder="Ex: Desenvolvedor Full Stack"
          required
        />

        <SelectField
          id={`vaga-cargo-${formId}`}
          name="cargo_id"
          label="Cargo (catálogo) *"
          options={cargoOptions}
          required
        />

        <TextArea
          id={`vaga-desc-${formId}`}
          name="vagaDesc"
          label="Descrição da Vaga *"
          placeholder="Descreva detalhadamente a vaga..."
          required
        />

        <TextArea
          id={`vaga-req-${formId}`}
          name="vagaRequisitos"
          label="Requisitos da vaga *"
          placeholder="Liste os requisitos necessários para a vaga..."
          required
        />

        <div className="row row-cols-1 row-cols-lg-2">
          <SelectField
            id={`vaga-tipo-${formId}`}
            name="vagaTipo"
            label="Tipo de Contratação *"
            options={vinculoOptions}
            required
          />

          {/* UF / Cidade vindos do banco */}
          <div className="row row-cols-2 g-2">
            <SelectField
              id={`vaga-uf-${formId}`}
              name="uf"
              label="UF"
              options={ufOptions}
            />
            <SelectField
              ref={cidadeRef}
              id={`vaga-cidade-${formId}`}
              name="cidade_id"
              label="Cidade"
              options={cidadeOptions}
            />
          </div>
        </div>

        <div className="row row-cols-1 row-cols-lg-2">
          <TextField
            id={`vaga-sal-${formId}`}
            name="vagaSalario"
            label="Faixa Salarial"
            placeholder="Ex: R$ 3.000 - R$ 5.000"
          />

          <SelectField
            id={`vaga-exp-${formId}`}
            name="vagaExp"
            label="Nível de experiência"
            options={nivelOptions}
          />
        </div>

        <div className="px-2">
          <FormCheck
            label="Esta é uma vaga remota"
            checked={isRemote}
            onChange={(e) => setIsRemote(e.target.checked)}
          />
        </div>

        <div className="d-flex justify-content-end mt-4">
          <Button type="submit" disabled={busy}>Publicar Vaga</Button>
        </div>
      </FormProvider>
    </Container>
  )
}
