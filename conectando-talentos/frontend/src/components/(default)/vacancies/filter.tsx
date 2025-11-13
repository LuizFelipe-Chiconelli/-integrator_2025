import { Button, Container } from "react-bootstrap"

import FormProvider from "@/components/form-kit/context"
import SelectField from "@/components/form-kit/fields/select-field"

// Hooks
import { useSearchParams } from "react-router-dom"

// Tipos
import type { Option } from "@/components/form-kit/types"

// Options
const typeOptions: Option[] = [
    { id: "", label: "Todos" },
    { id: "presencial", label: "Presencial" },
    { id: "remoto", label: "Remoto" }
]

const expOptions: Option[] = [
    { id: "", label: "Todos" },
    { id: "junior-trainee", label: "Júnior/Trainee" },
    { id: "pleno", label: "Pleno" },
    { id: "senior", label: "Senior" }
]

export default function VacanciesFilter() {
    const [_, setSearchParams] = useSearchParams()

    // Setar parâmetros
    const onSubmit = (formData: Record<string, any>) => {
        const modalityValue: string = formData.formModalidade as string
        const expValue: string = formData.formExp as string

        setSearchParams((prev: URLSearchParams) => {
            const updatedParams = new URLSearchParams(prev)

            // Setar parêmtros com o valor da variável ou nulo
            if (modalityValue) updatedParams.set("modalidade", modalityValue)
            if (expValue) updatedParams.set("nivel", expValue)

            // Remover valores nulos
            if (modalityValue == "") updatedParams.delete("modalidade")
            if (expValue == "") updatedParams.delete("nivel")

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
                    id="formModalidade"
                    name="formModalidade"
                    label="Modalidade da Vaga"
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