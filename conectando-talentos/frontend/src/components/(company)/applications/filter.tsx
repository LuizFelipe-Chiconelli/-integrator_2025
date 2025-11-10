"use client"

import { Form } from "react-bootstrap"
import type { Job } from "@/types/jobs"
import type { Option } from "@/components/form-kit/types"

type Props = {
    vacancies: Job[]
    value: { name: string, vacancy: string }
    onChange: (v: { name: string, vacancy: string }) => void
}

export default function ApplicationFilters({ vacancies, value, onChange }: Props) {
    const vacancyOptions: Option[] = [
        { id: "", label: "Selecione uma vaga" },
        ...vacancies.map(info => { return { id: info.vaga_id, label: info.titulo } })
    ]

    return (
        <Form className="row row-cols-1 row-cols-lg-2 g-2 mb-3">
            <div className="col">
                <Form.Label>Filtro</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Pesquisar nome do candidato"
                    value={value.name}
                    onChange={(e) => onChange({ ...value, name: e.target.value })}
                />
            </div>

            <div className="col">
                <Form.Label>Vaga</Form.Label>
                <Form.Select
                    value={value.vacancy}
                    onChange={(e) =>
                        onChange({ ...value, vacancy: e.target.value })
                    }
                >
                    {vacancyOptions.map(info => (
                        <option key={info.id} value={info.id}>{info.label}</option>
                    ))}
                </Form.Select>
            </div>
        </Form>
    )
}