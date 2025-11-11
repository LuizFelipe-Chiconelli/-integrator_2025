'use client'

import { Badge, Button, Modal } from "react-bootstrap"

import type { CandidateApplication } from "@/types/jobs"
import type { Option } from "@/components/form-kit/types"
import { useEffect, useState } from "react"
import { useCompanySessionContext } from "@/_session/company/context"
import { useNotificationContext } from "@/components/notifications/context"

const statusOptions: Option[] = [
    { id: 11, label: "Pendente" },
    { id: 12, label: "Em análise" },
    { id: 13, label: "Aprovada" },
    { id: 14, label: "Reprovada" },
    { id: 15, label: "Contratado" }
]

const sexo: Record<string, string> = {
    "M": "Masculino",
    "F": "Feminino"
}

interface Props {
    info?: CandidateApplication
    opened: boolean
    updateApplicationList: () => Promise<void>
    onClose: () => void
}

export default function ApplicationModal({ info, opened, onClose, updateApplicationList }: Props) {
    const [status, setStatus] = useState<number>(0)
    const [isPending, setIsPending] = useState<boolean>(false)

    const { sendNotification } = useNotificationContext()
    const { updateApplicationStatus } = useCompanySessionContext()

    const phone: string | undefined = info?.candidato_celular.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3")
    const dateString: string = new Date(`${info?.candidato_data_nascimento}T00:00:00`).toLocaleDateString("pt-BR", { timeZone: "UTC" })

    const handleSave = async (): Promise<void> => {
        if (isPending) return
        setIsPending(true)

        const res = await updateApplicationStatus({
            vaga_id: info!.vaga_id,
            curriculum_id: info!.curriculum_id,
            statusCandidatura: status
        })

        if (res.ok) {
            updateApplicationList()
            setIsPending(false)

            return sendNotification({ message: "Alterações salvas com sucesso!", type: "Success" })
        }

        setIsPending(false)
        return sendNotification({ message: "Erro ao salvar informações!", type: "Error" })
    }

    useEffect(() => {
        if (info) {
            setStatus(info?.statusCandidatura)
        }
    }, [info])

    return (
        <Modal show={opened} onHide={onClose} centered size="lg" backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Sobre o candidato</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {info && (
                    <>
                        <h2>{info.candidato_nome}</h2>
                        <p style={{ whiteSpace: "pre-wrap" }}>
                            {info.candidato_apresentacao}
                        </p>

                        <div className="d-flex flex-column mt-2">
                            <span><strong>Sexo:</strong> {sexo[info.candidato_sexo]}</span>
                            <span><strong>Email:</strong> {info.candidato_email}</span>
                            <span><strong>Telefone:</strong> {phone}</span>
                            <span><strong>Local:</strong> {info.candidato_cidade} - {info.candidato_uf}</span>
                            <span><strong>Data de nascimento</strong> {dateString}</span>
                        </div>

                        <div className="d-flex flex-column mt-5">
                            <h3>Escolaridade</h3>

                            {info.escolaridade.map((i) => (
                                <div className="d-flex flex-column">
                                    <span className="fs-5">{i.descricao} - {i.instituicao}</span>
                                    <div>
                                        <span>{i.inicioMes}/{i.inicioAno}</span> - <span>{i.fimMes}/{i.fimAno}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="d-flex flex-column mt-5">
                            <h3>Experiência Profissional</h3>

                            {info.experiencias.map((i) => (
                                <div className="d-flex flex-column">
                                    <span className="fs-5">{i.cargoDescricao} - {i.estabelecimento}</span>
                                    <div>
                                        <span>{i.inicioMes}/{i.inicioAno}</span> - <span>{i.fimMes}/{i.fimAno}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="d-flex flex-column mt-5">
                            <h3>Qualificações</h3>

                            {info.qualificacoes.map((i) => (
                                <div className="d-flex flex-column">
                                    <span className="fs-5">{i.descricao} - {i.estabelecimento}</span>
                                    <div>
                                        <span>{i.cargaHoraria} horas</span> - <span>{i.mes}/{i.ano}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {info.statusCandidatura != 16 && statusOptions.map(s => (
                            <div className="d-flex justify-content-between align-items-center mt-4">
                                <div className="d-flex gap-2">
                                    <Button
                                        key={s.id}
                                        variant={status === Number(s.id) ? "primary" : "outline-primary"}
                                        size="sm"
                                        disabled={isPending}
                                        onClick={() => setStatus(Number(s.id))}
                                    >
                                        {s.label}
                                    </Button>
                                </div>

                                <div className="d-flex gap-2">
                                    <Button onClick={handleSave} disabled={isPending}>
                                        {isPending ? "Salvando…" : "Salvar alterações"}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </Modal.Body>
        </Modal>
    )
}