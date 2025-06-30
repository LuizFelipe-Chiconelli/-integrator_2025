import { Button, Container, Form } from "react-bootstrap"

import Select from "../all/select"

// Hooks
import { useRef } from "react"
import { useSearchParams } from "react-router-dom"

// Tipos
import type { SyntheticEvent } from "react"
import type { Option, InputHandler } from "@/types/inputs"

// Options
const typeOptions: Option[] = [
    { id: "null", displayName: "Todos" },
    { id: "fulltime", displayName: "Integral" },
    { id: "halftime", displayName: "Meio Período" },
    { id: "homeoffice", displayName: "Remoto" },
    { id: "freelancer", displayName: "Freelancer" },
    { id: "internship", displayName: "Estágio" }
]

const expOptions: Option[] = [
    { id: "null", displayName: "Todos" },
    { id: "jr", displayName: "Júnior/Trainee" },
    { id: "pl", displayName: "Pleno" },
    { id: "sr", displayName: "Senior" },
    { id: "dir", displayName: "Gerente/Diretor" }
]

export default function JobsFilter() {
    const [_, setSearchParams] = useSearchParams()

    const typeRef = useRef<InputHandler>(null)
    const expRef = useRef<InputHandler>(null)

    // Setar parâmetros
    const setFilters = (): void => {
        let typeValue = typeRef.current?.getValue()
        let expValue = expRef.current?.getValue()

        setSearchParams((prev: URLSearchParams) => {
            const updatedParams = new URLSearchParams(prev)

            // Setar parêmtros com o valor da variável ou nulo
            if (typeValue) updatedParams.set("type", typeValue)
            if (expValue) updatedParams.set("exp", expValue)

            // Resetar página
            if (updatedParams.get("page")) updatedParams.delete("page")

            // Remover valores nulos
            if (typeValue == "null") updatedParams.delete("type")
            if (expValue == "null") updatedParams.delete("exp")

            return updatedParams
        })
    }

    const handleFilter = (e: SyntheticEvent) => {
        e.preventDefault()
        setFilters()
    }

    return (
        <Container className="border shadow-sm rounded-3 p-3">
            <h3 className="fw-bold mb-3">Filtros</h3>

            <Form
                onSubmit={handleFilter}
                className="d-flex flex-column gap-3 mb-3"
            >
                <Select
                    ref={typeRef}
                    label="Tipo de Vaga"
                    controlId="formTipo"
                    bg="white"
                    options={typeOptions}
                />

                <Select
                    ref={expRef}
                    label="Nível de Experiência"
                    controlId="formExp"
                    bg="white"
                    options={expOptions}
                />

                <Button type="submit">Filtrar</Button>
            </Form>
        </Container>
    )
}