'use client'

import { useRef } from "react"
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
    refreshList: () => Promise<void>
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

const gradeOptions: Option[] = [
    { id: "", label: "Selecione" },
    { id: "fundamental", label: "Ensino Fundamental" },
    { id: "medio", label: "Ensino Médio" },
    { id: "tecnico", label: "Técnico" },
    { id: "graduacao", label: "Graduação" },
    { id: "pos", label: "Pós-Graduação" },
    { id: "mestrado", label: "Mestrado" },
    { id: "doutorado", label: "Doutorado" }
]

const cityOptions: Option[] = [
    { id: "", label: "Selecione" },
    { id: "1", label: "Muriaé" },
    { id: "2", label: "Miraí" },
    { id: "3", label: "São Paulo" },
]

export default function EducationForm({ info, refreshList, setNewFormVisible }: Props) {
    const formId: string = useRef<SUUID>(short().generate()).current.toString()

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault()
        if (setNewFormVisible) return setNewFormVisible(false)
    }

    const onSubmit = (formData: Record<string, any>): void => {
        console.log(formData)
        refreshList()
        setNewFormVisible?.(false)
    }

    return (
        <FormProvider
            id={formId}
            onSubmit={onSubmit}
            className="border rounded-2 mt-3 p-4 shadow-sm bg-body"
        >
            <h3 className="fs-5 fw-bold mb-4">Escolaridade</h3>

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
                    placeholder="Selecione um ano"
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
                    placeholder="dd/mm/aa"
                    {...info?.fim_ano ? { initialValue: info.fim_ano } : {}}
                    required
                />
            </div>

            <div className="d-flex justify-content-end gap-2 mt-3">
                <Button variant="danger" onClick={handleDelete}>
                    <BsTrash /> Excluir
                </Button>
                <Button
                    type="submit"
                    variant="success"
                >
                    Salvar
                </Button>
            </div>
        </FormProvider>
    )
}