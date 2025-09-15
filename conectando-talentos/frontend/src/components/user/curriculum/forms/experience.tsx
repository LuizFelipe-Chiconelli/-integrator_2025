'use client'

import { useState, useRef } from "react"
import short, { type SUUID } from "short-uuid"
import type { Experience } from "@/types/user"
import type { FieldMethods, Option } from "@/components/form-kit/types"

import { BsTrash } from "react-icons/bs"
import { Button, FormCheck } from "react-bootstrap"

import FormProvider from "@/components/form-kit/context"
import TextField from "@/components/form-kit/fields/text-field"
import SelectField from "@/components/form-kit/fields/select-field"
import TextArea from "@/components/form-kit/fields/text-area"

interface Props {
  info?: Experience
  /** vindo da Section */
  onSave: (formData: Record<string, any>) => Promise<void>
  onDelete: () => Promise<void> | void
  /** lista de cargos vinda da Section */
  cargoOptions: Option[]
  setNewFormVisible?: (val: boolean) => void
}

const monthOptions: Option[] = [
  { id: "", label: "Selecione" },
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

export default function ExperienceForm({
  info,
  onSave,
  onDelete,
  cargoOptions,
  setNewFormVisible
}: Props) {
  const formId: string = useRef<SUUID>(short().generate()).current.toString()

  const fimMesRef = useRef<FieldMethods>(null)
  const fimAnoRef = useRef<FieldMethods>(null)

  // Emprego atual => TRUE quando NÃO há fim_ano (ou quando marcamos manualmente)
  const [currentWorking, setCurrentWorking] = useState<boolean>(() => !info?.fim_ano)

  const onChangeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setCurrentWorking(checked)
    if (checked) {
      // antes:
      // fimMesRef.current?.setValue("")
      // fimAnoRef.current?.setValue("")

      // depois (seguro p/ TS):
      fimMesRef.current?.setValue?.("")
      fimAnoRef.current?.setValue?.("")
    }
  }

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault()
    if (!info) {
      setNewFormVisible?.(false)
      return
    }
    await onDelete()
  }

  const onSubmit = async (formData: Record<string, any>): Promise<void> => {
    // validação leve: precisa de cargo_id OU cargo_descricao
    if (!formData.cargo_id && (!formData.cargo_descricao || !String(formData.cargo_descricao).trim())) {
      alert("Informe o cargo (selecione no catálogo ou descreva).")
      return
    }

    // envia também o flag de emprego atual para a Section montar o payload
    await onSave({ ...formData, empregoAtual: currentWorking })

    if (!info) setNewFormVisible?.(false)
  }

  return (
    <FormProvider
      id={formId}
      onSubmit={onSubmit}
      className="border rounded-2 mt-3 p-4 shadow-sm bg-body"
    >
      <h3 className="fs-5 fw-bold mb-4">Experiência</h3>

      <div className="row row-cols-lg-2 g-3">
        <TextField
          id={`estabelecimento-${formId}`}
          name="estabelecimento"
          label="Empresa / Estabelecimento *"
          placeholder="Ex: Tech Company"
          initialValue={info?.estabelecimento || ""}
          required
        />

        {/* catálogo de cargos (opcional) */}
        <SelectField
          id={`cargo-id-${formId}`}
          name="cargo_id"
          label="Cargo (catálogo)"
          options={cargoOptions}
          initialValue={String(info?.cargo_id )|| ""}
        />
      </div>

      <div className="row row-cols-lg-2 g-3">
        {/* descrição livre do cargo (alternativa ao catálogo) */}
        <TextField
          id={`cargo-desc-${formId}`}
          name="cargo_descricao"
          label="Cargo (descrição livre)"
          placeholder="Ex: Desenvolvedor de Sistemas"
          initialValue={info?.cargo_descricao || ""}
        />

        <div className="px-2 d-flex align-items-end">
          <FormCheck
            label="Emprego atual"
            checked={currentWorking}
            onChange={onChangeCheckbox}
          />
        </div>
      </div>

      <div className="row g-3">
        <TextArea
          id={`atividades-${formId}`}
          name="atividades_exercidas"
          label="Atividades exercidas"
          placeholder="Fale um pouco sobre o que fazia na empresa"
          initialValue={info?.atividades_exercidas || ""}
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
          initialValue={info?.inicio_ano || ""}
          required
        />

        {!currentWorking && (
          <>
            <SelectField
              ref={fimMesRef}
              id={`fim-mes-${formId}`}
              name="fim_mes"
              label="Mês de fim *"
              options={monthOptions}
              initialValue={info?.fim_mes || ""}
              required
            />

            <TextField
              ref={fimAnoRef}
              id={`fim-ano-${formId}`}
              name="fim_ano"
              label="Ano de fim *"
              placeholder="Ex: 2025"
              initialValue={info?.fim_ano || ""}
              required
            />
          </>
        )}
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
