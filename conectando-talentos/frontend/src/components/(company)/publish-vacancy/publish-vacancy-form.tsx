'use client'

import short, { type SUUID } from "short-uuid"
import { useNavigate } from "react-router-dom"
import { useEffect, useMemo, useRef, useState } from "react"
import { useCompanySessionContext } from "@/_session/company/context"
import { useNotificationContext } from "@/components/notifications/context"
import { Button, Col, Container, FormCheck, Spinner } from "react-bootstrap"

import type { Job } from "@/types/jobs"
import type { Option, FieldMethods } from "@/components/form-kit/types"

import api from "@/actions/api"

import FormProvider from "@/components/form-kit/context"
import TextArea from "@/components/form-kit/fields/text-area"
import DateField from "@/components/form-kit/fields/date-field"
import TextField from "@/components/form-kit/fields/text-field"
import PriceField from "@/components/form-kit/fields/price-field"
import SelectField from "@/components/form-kit/fields/select-field"

interface CargoAPI { cargo_id: number; descricao: string }
interface CidadeAPI { id: number; nome: string; uf: string }

const optionSelecione: Option = { id: "", label: "Selecione" }

const vinculoOptions: Option[] = [
    optionSelecione,
    { id: "1", label: "CLT" },
    { id: "2", label: "PJ" },
    { id: "3", label: "Estágio" },
    { id: "4", label: "Temporário" },
]

const nivelOptions: Option[] = [
    optionSelecione,
    { id: "1", label: "Júnior" },
    { id: "2", label: "Pleno" },
    { id: "3", label: "Sênior" },
    { id: "4", label: "Líder" },
]

export default function PublishVacancyForm() {
    const formId: string = useRef<SUUID>(short().generate()).current.toString()

    const navigate = useNavigate()

    const [loading, setLoading] = useState<boolean>(true)
    const [isPending, setIsPending] = useState<boolean>(false)
    const [cargos, setCargos] = useState<CargoAPI[]>([])
    const [cidades, setCidades] = useState<CidadeAPI[]>([])
    const [isRemote, setIsRemote] = useState<boolean>(false)

    const cidadeRef = useRef<FieldMethods>(null)

    const cargoOptions: Option[] = useMemo(
        () => [optionSelecione, ...cargos.map(c => ({ id: String(c.cargo_id), label: c.descricao }))],
        [cargos]
    )

    const ufOptions: Option[] = useMemo(() => {
        const ufs = Array.from(new Set(cidades.map(c => c.uf))).sort()
        return [optionSelecione, ...ufs.map(uf => ({ id: uf, label: uf }))]
    }, [cidades])

    const cidadeOptions: Option[] = useMemo(
        () => [optionSelecione, ...cidades.map(c => ({ id: String(c.id), label: c.nome }))],
        [cidades]
    )

    const { createJobVacancy } = useCompanySessionContext()
    const { sendNotification } = useNotificationContext()

    useEffect(() => {
        (async () => {
            try {
                const { data: dc } = await api.get<{ status: number; cargos: CargoAPI[] }>("/vaga/cargos")
                setCargos(dc?.cargos ?? [])
                const { data: dz } = await api.get<{ status: number; cidades: CidadeAPI[] }>("/cidade/lista")
                setCidades(dz?.cidades ?? [])
            } catch (e) {
                console.error(e)
                alert("Erro ao carregar dados iniciais (cargos/cidades).")
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const onSubmit = async (formData: Record<string, any>): Promise<void> => {
        if (isPending) return
        setIsPending(true)

        const cidade: string = cidadeOptions.find(c => c.id == formData.cidade_id)?.label || ''
        const uf: string = ufOptions.find(u => u.id == formData.uf)?.label || ''
        const localizacao: string = `${cidade} - ${uf}`

        const payload = {
            titulo: formData.titulo,
            descricao: formData.descricao.trim(),
            cargo_id: formData.cargo_id,
            requisitos: formData.requisitos,
            localizacao: localizacao,
            salario_minimo: formData.salario_minimo,
            salario_maximo: formData.salario_maximo,
            nivel: formData.nivel,
            modalidade: isRemote ? 2 : 1,
            vinculo: formData.vinculo,
            dtInicio: new Date().toDateString(),
            dtFim: formData.dtFim,
            statusVaga: 11
        }

        const res = await createJobVacancy(payload as Job)

        if (res.ok) {
            sendNotification({ message: "Vaga postada com sucesso!", type: "Success" })
            setIsPending(false)

            return navigate('/minha-empresa/vagas')
        }

        sendNotification({ message: res.message!, type: "Error" })
        return setIsPending(false)
    }

    return (
        <Container className="bg-white border rounded-3 p-4 shadow-sm">
            <h1 className="fs-3 fw-bold m-0">Publicar Nova Vaga</h1>
            <span>Preencha os detalhes da vaga que você deseja publicar</span>

            <Container className="px-0">
                <div className="d-flex align-items-center gap-2 mb-3">
                    {(loading) && <Spinner size="sm" animation="border" />}
                </div>

                <FormProvider id={formId} onSubmit={onSubmit}>
                    {/* Nome da vaga (titulo) */}
                    <TextField
                        id={`vaga-titulo-${formId}`}
                        name="titulo"
                        label="Nome da vaga *"
                        placeholder="Ex: Desenvolvedor Full Stack"
                        required
                    />

                    {/* Cargo do catálogo (obrigatório) */}
                    <SelectField
                        id={`vaga-cargo-${formId}`}
                        name="cargo_id"
                        label="Cargo (catálogo) *"
                        options={cargoOptions}
                        required
                    />

                    {/* Sobre a vaga (texto longo) */}
                    <TextArea
                        id={`vaga-descricao-${formId}`}
                        name="descricao"
                        label="Sobre a Vaga *"
                        placeholder="Descreva responsabilidades, benefícios, stack etc."
                        required
                    />

                    {/* Requisitos (obrigatório) */}
                    <TextArea
                        id={`vaga-requisitos-${formId}`}
                        name="requisitos"
                        label="Requisitos *"
                        placeholder="Liste os requisitos necessários para a vaga..."
                        required
                    />

                    {/* Vínculo + Localização (UF & Cidade) */}
                    <div className="row row-cols-1 row-cols-lg-4 g-3">
                        <Col className="col-lg-6">
                            <SelectField
                                id={`vaga-vinculo-${formId}`}
                                name="vinculo"
                                label="Tipo de Contratação *"
                                options={vinculoOptions}
                                required
                            />
                        </Col>

                        <SelectField
                            id={`vaga-uf-${formId}`}
                            name="uf"
                            label="Estado *"
                            options={ufOptions}
                            required
                        />

                        <SelectField
                            ref={cidadeRef}
                            id={`vaga-cidade-${formId}`}
                            name="cidade_id"
                            label="Cidade *"
                            options={cidadeOptions}
                            required
                        />
                    </div>

                    {/* Salário + Nível */}
                    <div className="row row-cols-1 row-cols-lg-4 g-3">
                        <PriceField
                            id={`vaga-sal-${formId}`}
                            name="salario_minimo"
                            label="Pagamento mínimo *"
                            placeholder="Ex: R$ 3.000"
                            required
                        />

                        <PriceField
                            id={`vaga-sal-${formId}`}
                            name="salario_maximo"
                            label="Pagamento máximo *"
                            placeholder="Ex: R$ 5.000"
                            required
                        />

                        <Col className="col-lg-6">
                            <SelectField
                                id={`vaga-nivel-${formId}`}
                                name="nivel"
                                label="Nível *"
                                options={nivelOptions}
                                required
                            />
                        </Col>
                    </div>

                    {/* Modalidade (remoto) + Data fim */}
                    <div className="row row-cols-1 row-cols-lg-2 g-3">
                        <div className="px-2 d-flex align-items-center">
                            <FormCheck
                                label="Esta é uma vaga remota"
                                checked={isRemote}
                                onChange={(e) => setIsRemote(e.target.checked)}
                            />
                        </div>

                        <DateField
                            id={`vaga-dtfim-${formId}`}
                            name="dtFim"
                            label="Data de encerramento *"
                            placeholder="DD/MM/AAAA"
                            required
                        />
                    </div>

                    <div className="d-flex justify-content-end mt-4">
                        <Button type="submit">Publicar Vaga</Button>
                    </div>
                </FormProvider>
            </Container>
        </Container >
    )
}