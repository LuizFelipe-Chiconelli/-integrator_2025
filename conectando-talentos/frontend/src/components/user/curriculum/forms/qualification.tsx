'use client'

import { useRef } from "react"
import short, { type SUUID } from "short-uuid"
import type { Qualification } from "@/types/user"
import type { Option } from "@/components/form-kit/types"

import { BsTrash } from "react-icons/bs"
import { Button } from "react-bootstrap"

import FormProvider from "@/components/form-kit/context"
import TextField from "@/components/form-kit/fields/text-field"
import SelectField from "@/components/form-kit/fields/select-field"

interface Props {
  info?: Qualification
  /** callbacks vindos da Section */
  onSave: (formData: Record<string, any>) => Promise<void>
  onDelete: () => Promise<void> | void
  setNewFormVisible?: (val: boolean) => void
}

const monthOptions: Option[] = [
  { id: "", label: "Selecione" },
  { id: "1", label: "01" }, { id: "2", label: "02" }, { id: "3", label: "03" },
  { id: "4", label: "04" }, { id: "5", label: "05" }, { id: "6", label: "06" },
  { id: "7", label: "07" }, { id: "8", label: "08" }, { id: "9", label: "09" },
  { id: "10", label: "10" }, { id: "11", label: "11" }, { id: "12", label: "12" }
]

export default function QualificationForm({ info, onSave, onDelete, setNewFormVisible }: Props) {
  const formId: string = useRef<SUUID>(short().generate()).current.toString()

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault()
    if (!info) return setNewFormVisible?.(false) // cancelar quando for novo
    await onDelete()
  }

  const onSubmit = async (formData: Record<string, any>): Promise<void> => {
    // validação mínima no cliente (o back já valida também)
    if (!formData.descricao || !formData.estabelecimento || !formData.carga_horaria || !formData.mes || !formData.ano) {
      alert("Preencha: descrição, instituição, carga horária, mês e ano.")
      return
    }
    await onSave(formData)
    if (!info) setNewFormVisible?.(false)
  }

  return (
    <FormProvider
      id={formId}
      onSubmit={onSubmit}
      className="border rounded-2 mt-3 p-4 shadow-sm bg-body"
    >
      <h3 className="fs-5 fw-bold mb-4">Curso / Qualificação</h3>

      <div className="row row-cols-lg-2 g-3">
        <TextField
          id={`desc-${formId}`}
          name="descricao"
          label="Nome / Descrição do curso *"
          placeholder="Ex: Desenvolvimento Front-end"
          initialValue={info?.descricao || ""}
          required
        />

        <TextField
          id={`estabelecimento-${formId}`}
          name="estabelecimento"
          label="Instituição *"
          placeholder="Ex: Faculdade Santa Marcelina"
          initialValue={info?.estabelecimento || ""}
          required
        />
      </div>

      <div className="row row-cols-lg-3 g-3">
        <TextField
          id={`carga-${formId}`}
          name="carga_horaria"
          label="Carga horária (h) *"
          placeholder="120"
          initialValue={info?.carga_horaria || ""}
          required
        />

        <SelectField
          id={`mes-${formId}`}
          name="mes"
          label="Mês de finalização *"
          options={monthOptions}
          initialValue={info?.mes || ""}
          required
        />

        <TextField
          id={`ano-${formId}`}
          name="ano"
          label="Ano de finalização *"
          placeholder="Ex: 2025"
          initialValue={info?.ano || ""}
          required
        />
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button variant={info ? "danger" : "secondary"} onClick={handleDelete}>
          <BsTrash /> {info ? "Excluir" : "Cancelar"}
        </Button>
        <Button type="submit" variant="success">Salvar</Button>
      </div>
    </FormProvider>
  )
}
