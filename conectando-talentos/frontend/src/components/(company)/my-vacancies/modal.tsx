'use client'

import FormFields from "./form-fields"
import FormProvider from "@/components/form-kit/context"

import { useEffect, useMemo, useState } from "react"
import { Button, Modal, Spinner } from "react-bootstrap"
import { useCompanySessionContext } from "@/_session/company/context"
import { useNotificationContext } from "@/components/notifications/context"

import type { Job } from "@/types/jobs"
import type { Option } from "@/components/form-kit/types"
import api from "@/actions/api"

interface CidadeAPI { id: number; nome: string; uf: string }

const statusOptions: Option[] = [
    { id: "11", label: "Em aberto" },
    { id: "12", label: "Pausada" },
    { id: "13", label: "Fechada" },
    { id: "14", label: "Cancelada" },
]

interface Props {
    info?: Job
    opened: boolean
    updateVacancyList: () => Promise<void>
    onClose: () => void
}

const optionSelecione: Option = { id: "", label: "Selecione" }

export default function VacancyModal({ info, opened, onClose, updateVacancyList }: Props) {
    const [roleOptions, setRoleOptions] = useState<Option[]>([])
    const [isPending, setIsPending] = useState<boolean>(false)
    const [status, setStatus] = useState<number>(info?.statusVaga || 11)

    const { sendNotification } = useNotificationContext()
    const { updateVacancy, updateVacancyStatus } = useCompanySessionContext()

    const [cities, setCities] = useState<CidadeAPI[]>([])
    const [selectedUf, setSelectedUf] = useState<string>("")
    const [selectedCity, setSelectedCity] = useState<string>("")

    const getCities = async (): Promise<void> => {
        const { data: dz } = await api.get<{ status: number; cidades: CidadeAPI[] }>("/cidade/lista")
        setCities(dz?.cidades ?? [])
    }

    const getRoles = async (): Promise<void> => {
        const { data: { cargos } }: { data: { cargos: { cargo_id: number; descricao: string }[] } } = await api.get(`/vaga/cargos`)
        const roleOptions: Option[] = cargos.map(c => { return { id: c.cargo_id, label: c.descricao } })

        setRoleOptions(roleOptions)
    }

    const ufOptions: Option[] = useMemo(() => {
        const ufs = Array.from(new Set(cities.map(c => c.uf))).sort()
        return [optionSelecione, ...ufs.map(uf => ({ id: uf, label: uf }))]
    }, [cities])

    const filteredCities: CidadeAPI[] = cities.filter(c => { return c.uf == selectedUf })

    const cityOptions: Option[] = [optionSelecione, ...filteredCities.map(c => {
        return { id: String(c.id), label: c.nome }
    })]

    const handleStatus = async (status: number): Promise<void> => {
        const res = await updateVacancyStatus(String(info!.vaga_id), status)

        if (res.ok) {
            return setStatus(status)
        }

        return sendNotification({ message: res.message!, type: "Error" })
    }

    const onSubmit = async (formData: Record<string, any>) => {
        try {
            if (isPending) return
            setIsPending(true)

            if (status != info?.statusVaga) {
                handleStatus(status)
            }

            const cityName: string = cities.find(c => { return String(c.id) == formData.city })!.nome

            const payload: Record<string, any> = {
                vaga_id: info!.vaga_id,
                cargo_id: Number(formData.cargo_id),
                titulo: formData.titulo,
                descricao: formData.sobreVaga,
                requisitos: formData.requisitos,
                localizacao: `${cityName} - ${formData.uf}`,
                salario_minimo: formData.salario_minimo,
                salario_maximo: formData.salario_maximo,
                nivel: Number(formData.nivel),
                modalidade: Number(formData.modalidade),
                vinculo: Number(formData.vinculo),
                dtFim: formData.dtFim,
            }

            const res = await updateVacancy(payload as Job)

            if (res.ok) {
                return sendNotification({ message: "Alterações salvas com sucesso", type: "Success" })
            }

            return sendNotification({ message: res.message!, type: "Error" })
        } finally {
            setIsPending(false)
            await updateVacancyList()
        }
    }

    useEffect(() => {
        if (info) {
            if (selectedUf === "" || selectedCity === "") {
                const cityId: number | undefined = cities.find(c => {
                    return c.nome === info.localizacao.split("-")[0].trim() && c.uf == info.localizacao.split("-")[1].trim()
                })?.id

                const uf: string = String(cities.find(c => c.id == cityId)?.uf || "")
                setSelectedUf(uf)
                setSelectedCity(String(cityId))
            }
        }
    }, [cities, ufOptions, cityOptions])

    useEffect(() => {
        if (info) {
            setStatus(Number(info.statusVaga))
        }
    }, [info])

    useEffect(() => {
        getRoles()
        getCities()
    }, [])

    return (
        <Modal show={opened} onHide={onClose} centered size="lg" backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Gerenciar vaga</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {!info ? (
                    <div className="d-flex align-items-center gap-2">
                        <Spinner size="sm" animation="border" /> Carregando…
                    </div>
                ) : (
                    <FormProvider onSubmit={onSubmit}>
                        <FormFields
                            info={info}
                            cityOptions={cityOptions}
                            roleOptions={roleOptions}
                            ufOptions={ufOptions}
                            selectedCity={selectedCity}
                            selectedUf={selectedUf}
                            setSelectedCity={setSelectedCity}
                            setSelectedUf={setSelectedUf}
                        />

                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <div className="d-flex gap-2">
                                {statusOptions.map(s => (
                                    <Button
                                        key={s.id}
                                        variant={status === Number(s.id) ? "primary" : "outline-primary"}
                                        size="sm"
                                        disabled={isPending}
                                        onClick={() => setStatus(Number(s.id))}
                                    >
                                        {s.label}
                                    </Button>
                                ))}
                            </div>

                            <div className="d-flex gap-2">
                                <Button variant="danger"
                                    // onClick={handleDelete}
                                    disabled={isPending}>
                                    Excluir
                                </Button>

                                <Button type="submit" disabled={isPending}>
                                    {isPending ? "Salvando…" : "Salvar alterações"}
                                </Button>
                            </div>
                        </div>
                    </FormProvider>
                )}
            </Modal.Body>
        </Modal>
    )
}