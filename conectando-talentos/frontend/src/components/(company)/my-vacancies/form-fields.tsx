import TextArea from "@/components/form-kit/fields/text-area"
import TextField from "@/components/form-kit/fields/text-field"
import DateField from "@/components/form-kit/fields/date-field"
import PriceField from "@/components/form-kit/fields/price-field"
import SelectField from "@/components/form-kit/fields/select-field"

import { Col, Row } from "react-bootstrap"
import { useEffect, useRef } from "react"

import type { Job } from "@/types/jobs"
import type { FieldMethods, Option } from "@/components/form-kit/types"

const optionSelecione: Option = { id: "", label: "Selecione" }

const vinculoOptions: Option[] = [
    optionSelecione,
    { id: "1", label: "CLT" },
    { id: "2", label: "PJ" },
    { id: "3", label: "Estágio" },
    { id: "4", label: "Temporário" },
]

const modalidadeOptions: Option[] = [
    optionSelecione,
    { id: "1", label: "Presencial" },
    { id: "2", label: "Remoto" },
]

const nivelOptions: Option[] = [
    optionSelecione,
    { id: "1", label: "Júnior" },
    { id: "2", label: "Pleno" },
    { id: "3", label: "Sênior" },
    { id: "4", label: "Líder" },
]

interface Props {
    info: Job
    cityOptions: Option[]
    roleOptions: Option[]
    ufOptions: Option[]
    selectedUf: string
    selectedCity: string
    setSelectedUf: (val: string) => void
    setSelectedCity: (val: string) => void
}

export default function FormFields({
    info,
    cityOptions,
    roleOptions,
    ufOptions,
    selectedUf,
    selectedCity,
    setSelectedUf,
    setSelectedCity
}: Props) {
    const ufRef = useRef<FieldMethods>(null)
    const roleRef = useRef<FieldMethods>(null)
    const cityRef = useRef<FieldMethods>(null)

    useEffect(() => {
        const city: string | undefined = cityRef.current?.getValue()
        const uf: string | undefined = ufRef.current?.getValue()

        if (uf != selectedUf) ufRef.current?.setValue?.(selectedUf)
        if (city != selectedCity) cityRef.current?.setValue?.(selectedCity)
    }, [selectedUf, selectedCity])

    return (
        <>
            <Row className="g-3">
                <Col lg={8}>
                    <TextField
                        id={`titulo`}
                        name="titulo"
                        label="Título *"
                        initialValue={info.titulo || ""}
                        required
                    />
                </Col>

                <Col lg={4}>
                    <SelectField
                        ref={roleRef}
                        id={`cargo`}
                        name="cargo_id"
                        label="Cargo (catálogo) *"
                        options={roleOptions}
                        required
                    />
                </Col>

                <Col lg={12}>
                    <TextArea
                        id={`sobre`}
                        name="sobreVaga"
                        label="Sobre a vag *"
                        initialValue={info.descricao}
                        required
                    />
                </Col>

                <Col lg={12}>
                    <TextArea
                        id={`req`}
                        name="requisitos"
                        label="Requisitos *"
                        initialValue={info.requisitos || ""}
                        required
                    />
                </Col>

                <Col lg={6}>
                    <SelectField
                        ref={ufRef}
                        id={`estado`}
                        name="uf"
                        label="Estado *"
                        options={ufOptions}
                        onChange={setSelectedUf}
                        required
                    />
                </Col>

                <Col lg={6}>
                    <SelectField
                        ref={cityRef}
                        id={`cidade`}
                        name="city"
                        label="Cidade *"
                        options={cityOptions}
                        onChange={setSelectedCity}
                        required
                    />
                </Col>

                <Col lg={3}>
                    <PriceField
                        id={`sal-min`}
                        name="salario_minimo"
                        label="Pagamento mínimo *"
                        placeholder="Ex: R$ 3.000"
                        initialValue={info.salario_minimo || ""}
                        required
                    />
                </Col>

                <Col lg={3}>
                    <PriceField
                        id={`sal-max`}
                        name="salario_maximo"
                        label="Pagamento máximo *"
                        placeholder="Ex: R$ 5.000"
                        initialValue={info.salario_maximo || ""}
                        required
                    />
                </Col>

                <Col lg={6}>
                    <SelectField
                        id={`nivel`}
                        name="nivel"
                        label="Nível *"
                        options={nivelOptions}
                        initialValue={info.nivel ? String(info.nivel) : ""}
                        required
                    />
                </Col>

                <Col lg={4}>
                    <SelectField
                        id={`mod`}
                        name="modalidade"
                        label="Modalidade *"
                        options={modalidadeOptions}
                        initialValue={String(info.modalidade)}
                        required
                    />
                </Col>

                <Col lg={4}>
                    <SelectField
                        id={`vin`}
                        name="vinculo"
                        label="Vínculo *"
                        options={vinculoOptions}
                        initialValue={String(info.vinculo)}
                        required
                    />
                </Col>

                <Col lg={4}>
                    <DateField
                        id={`fim`}
                        name="dtFim"
                        label="Data de encerramento *"
                        initialValue={String(info.dtFim) || ""}
                        required
                    />
                </Col>
            </Row>
        </>
    )
}