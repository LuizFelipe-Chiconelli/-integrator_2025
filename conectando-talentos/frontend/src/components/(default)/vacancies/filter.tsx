import { Button, Container } from "react-bootstrap"

import FormProvider from "@/components/form-kit/context"
import SelectField from "@/components/form-kit/fields/select-field"

// Hooks
import { useSearchParams } from "react-router-dom"

// Tipos
import type { Option } from "@/components/form-kit/types"

// Options
const typeOptions: Option[] = [
    { id: "null", label: "Todos" },
    { id: "fulltime", label: "Integral" },
    { id: "halftime", label: "Meio Período" },
    { id: "homeoffice", label: "Remoto" },
    { id: "freelancer", label: "Freelancer" },
    { id: "internship", label: "Estágio" }
]

const expOptions: Option[] = [
    { id: "null", label: "Todos" },
    { id: "jr", label: "Júnior/Trainee" },
    { id: "pl", label: "Pleno" },
    { id: "sr", label: "Senior" },
    { id: "dir", label: "Gerente/Diretor" }
]

export default function VacanciesFilter() {
    const [_, setSearchParams] = useSearchParams()

    // Setar parâmetros
    const onSubmit = (formData: Record<string, any>) => {
        const typeValue: string = formData.formTipo as string
        const expValue: string = formData.formExp as string

        setSearchParams((prev: URLSearchParams) => {
            const updatedParams = new URLSearchParams(prev)

            // Setar parêmtros com o valor da variável ou nulo
            if (typeValue) updatedParams.set("type", String(typeValue))
            if (expValue) updatedParams.set("exp", String(expValue))

            // Resetar página
            if (updatedParams.get("page")) updatedParams.delete("page")

            // Remover valores nulos
            if (typeValue == "null") updatedParams.delete("type")
            if (expValue == "null") updatedParams.delete("exp")

            return updatedParams
        })
    }

    return (
        <Container className="border shadow-sm rounded-3 p-3">
            <h3 className="fw-bold mb-3">Filtros</h3>

            <FormProvider
                onSubmit={onSubmit}
                className="d-flex flex-column gap-3 mb-3"
            >
                <SelectField
                    id="formTipo"
                    name="formTipo"
                    label="Tipo de Vaga"
                    bg="white"
                    options={typeOptions}
                />

                <SelectField
                    id="formExp"
                    name="formExp"
                    label="Nível de Experiência"
                    bg="white"
                    options={expOptions}
                />

                <Button type="submit">Filtrar</Button>
            </FormProvider>
        </Container>
    )
}