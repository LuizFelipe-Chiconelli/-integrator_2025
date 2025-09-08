'use client'

import { useEffect, useMemo, useRef, useState } from "react"
import type { Scholarity } from "@/types/user"
import short, { type SUUID } from "short-uuid"
import type { Option } from "@/components/form-kit/types"

import { Button } from "react-bootstrap"
import { BsTrash } from "react-icons/bs"

import FormProvider from "@/components/form-kit/context"
import TextField from "@/components/form-kit/fields/text-field"
import SelectField from "@/components/form-kit/fields/select-field"

interface Props {
  info?: Scholarity
  /** callbacks vindos da Section (lógica fica lá) */
  onSave: (formData: Record<string, any>) => Promise<void>
  onDelete: () => Promise<void> | void
  /** listas para montar UF e cidades (vindas da Section) */
  ufOptions: Option[]
  cidades: { id: number; nome: string; uf: string }[]
  /** para fechar o form novo após salvar/cancelar, se aplicável */
  setNewFormVisible?: (val: boolean) => void
}

const optionSelecione: Option = { id: "", label: "Selecione" }

const monthOptions: Option[] = [
  optionSelecione,
  { id: "1", label: "01" },
  { id: "2", label: "02" },
  { id: "3", label: "03" },
  { id: "4", label: "04" },
  { id: "5", label: "05" },
  { id: "6", label: "06" },
  { id: "7", label: "07" },
  { id: "8", label: "08" },
  { id: "9", label: "09" },
  { id: "10", label: "10" },
  { id: "11", label: "11" },
  { id: "12", label: "12" }
]

const gradeOptions: Option[] = [
  optionSelecione,
  { id: "fundamental", label: "Ensino Fundamental" },
  { id: "medio", label: "Ensino Médio" },
  { id: "tecnico", label: "Técnico" },
  { id: "graduacao", label: "Graduação" },
  { id: "pos", label: "Pós-Graduação" },
  { id: "mestrado", label: "Mestrado" },
  { id: "doutorado", label: "Doutorado" }
]

export default function EducationForm({
  info,
  onSave,
  onDelete,
  ufOptions,
  cidades,
  setNewFormVisible
}: Props) {
  // id único do form
  const formId: string = useRef<SUUID>(short().generate()).current.toString()

  // ===== UF + Cidades dinâmicas
  // UF inicial: se houver cidade no registro, deduz pela lista de cidades
  const initialUF = useMemo(() => {
    const cid = Number(info?.cidade_id || 0)
    return cidades.find(c => c.id === cid)?.uf || ""
  }, [info?.cidade_id, cidades])

  const [uf, setUf] = useState<string>(initialUF)

  // options de cidade filtradas pela UF
  const cityOptions: Option[] = useMemo(() => {
    if (!uf) return [optionSelecione]
    const filtradas = cidades.filter(c => c.uf === uf)
    return [optionSelecione, ...filtradas.map(c => ({ id: String(c.id), label: c.nome }))]
  }, [cidades, uf])

  // quando a prop info mudar (ex.: trocar de item), reavaliar UF
  useEffect(() => {
    setUf(initialUF)
  }, [initialUF])

  // ===== Ações
  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault()
    // Se for um form "novo", o Delete vira "Cancelar"
    if (!info) {
      setNewFormVisible?.(false)
      return
    }
    await onDelete()
  }

  const handleSubmit = async (formData: Record<string, any>) => {
    // Incluímos "uf" no form apenas para coerência visual; o backend não usa,
    // mas ela serve para filtrar cidade corretamente. O payload final é montado na Section.
    await onSave(formData)
    if (!info) setNewFormVisible?.(false)
  }

  return (
    <FormProvider
      id={formId}
      onSubmit={handleSubmit}
      className="border rounded-2 mt-3 p-4 shadow-sm bg-body"
    >
      <h3 className="fs-5 fw-bold mb-4">Formação</h3>

      <div className="row row-cols-lg-2 g-3">
        <SelectField
          id={`grau-${formId}`}
          name="grau"
          label="Grau escolar *"
          options={gradeOptions}
          initialValue={info?.grau || ""}
          required
        />

        <TextField
          id={`desc-${formId}`}
          name="descricao"
          label="Curso / Descrição *"
          placeholder="Ex: Análise e Desenvolvimento de Sistemas"
          {...info?.descricao ? { initialValue: info.descricao } : {}}
          required
        />
      </div>

      <div className="row row-cols-lg-2 g-3">
        <TextField
          id={`instituicao-${formId}`}
          name="instituicao"
          label="Instituição *"
          placeholder="Ex: Faculdade Santa Marcelina"
          {...info?.instituicao ? { initialValue: info.instituicao } : {}}
          required
        />

        {/* UF controla a lista de cidades */}
        <SelectField
          id={`uf-${formId}`}
          name="uf"
          label="UF *"
          options={ufOptions}
          initialValue={uf || ""}
          required
          onChange={(val) => {
            setUf(val)
          }}
        />
      </div>

      <div className="row row-cols-lg-2 g-3">
        <SelectField
          id={`cidade-${formId}`}
          name="cidade_id"
          label="Cidade *"
          options={cityOptions}
          initialValue={info?.cidade_id || ""}
          required
        />
      </div>

      <div className="row row-cols-lg-4 g-3">
        <SelectField
          id={`inicio-mes-${formId}`}
          name="inicio_mes"
          label="Mês de início *"
          options={monthOptions}
          initialValue={info?.inicio_mes || ""}
          required
        />

        <TextField
          id={`inicio-ano-${formId}`}
          name="inicio_ano"
          label="Ano de início *"
          placeholder="Ex: 2022"
          {...info?.inicio_ano ? { initialValue: info.inicio_ano } : {}}
          required
        />

        <SelectField
          id={`fim-mes-${formId}`}
          name="fim_mes"
          label="Mês de fim *"
          options={monthOptions}
          initialValue={info?.fim_mes || ""}
          required
        />

        <TextField
          id={`fim-ano-${formId}`}
          name="fim_ano"
          label="Ano de fim *"
          placeholder="Ex: 2025"
          {...info?.fim_ano ? { initialValue: info.fim_ano } : {}}
          required
        />
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button variant={info ? "danger" : "secondary"} onClick={handleDelete}>
          <BsTrash /> {info ? "Excluir" : "Cancelar"}
        </Button>
        <Button type="submit" variant="success">
          Salvar
        </Button>
      </div>
    </FormProvider>
  )
}
