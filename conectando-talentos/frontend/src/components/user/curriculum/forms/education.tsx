'use client'

import { useRef } from "react"
import short, { type SUUID } from "short-uuid"

import { Button } from "react-bootstrap"
import { BsTrash } from "react-icons/bs"

import FormProvider from "@/components/form-kit/context"
import TextField from "@/components/form-kit/fields/text-field"

export default function EducationForm() {
    const formId: string = useRef<SUUID>(short().generate()).current.toString()

    const onSubmit = (formData: Record<string, any>) => {
        console.log(formData)
    }

    return (
        <FormProvider
            id={formId}
            onSubmit={onSubmit}
            className="border rounded-2 mt-3 p-4 shadow-sm bg-body"
        >
            <h3 className="fs-5 fw-bold mb-4">Escolaridade</h3>

            <div className="row row-cols-lg-2 g-3">
                <TextField
                    id={`grau-${formId}`}
                    name="grau"
                    label="Grau escolar *"
                    placeholder="Selecione seu grau escolar"
                    required
                />

                <TextField
                    id={`desc-${formId}`}
                    name="descricao"
                    label="Curso / Descrição *"
                    placeholder="Ex: Análise e Desenvolvimento de Sistemas"
                    required
                />
            </div>

            <div className="row row-cols-lg-2 g-3">
                <TextField
                    id={`instituicao-${formId}`}
                    name="instituicao"
                    label="Instituição *"
                    placeholder="Ex: Faculdade Santa Marcelina"
                    required
                />

                <TextField
                    id={`cidade-${formId}`}
                    name="cidade_id"
                    label="Cidade *"
                    placeholder="Selecione a cidade"
                    required
                />
            </div>

            <div className="row row-cols-lg-4 g-3">
                <TextField
                    id={`inicio-mes-${formId}`}
                    name="inicio_mes"
                    label="Mês de início *"
                    placeholder="Selecione um mês"
                    required
                />

                <TextField
                    id={`inicio-ano-${formId}`}
                    name="inicio_ano"
                    label="Mês de início *"
                    placeholder="Selecione um mês"
                    required
                />

                <TextField
                    id={`fim-mes-${formId}`}
                    name="fim_mes"
                    label="Mês de fim *"
                    placeholder="Selecione um mês"
                    required
                />

                <TextField
                    id={`fim-ano-${formId}`}
                    name="fim_ano"
                    label="Ano de fim *"
                    placeholder="dd/mm/aa"
                    required
                />
            </div>

            <div className="d-flex justify-content-end gap-2 mt-3">
                <Button variant="danger" onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.preventDefault() }}>
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