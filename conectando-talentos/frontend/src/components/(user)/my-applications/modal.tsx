'use client'

import { Badge, Button, Modal } from "react-bootstrap"

import type { Application } from "@/types/jobs"
import { useUserSessionContext } from "@/_session/user/context"
import { useNotificationContext } from "@/components/notifications/context"
import { useState } from "react"

const modalidade: Record<number, string> = {
    1: "Presencial",
    2: "Remoto",
}

const vinculo: Record<number, string> = {
    1: "CLT",
    2: "PJ",
    3: "Estágio",
    4: "Temporário"
}

interface Props {
    info?: Application
    opened: boolean
    updateApplicationList: () => Promise<void>
    onClose: () => void
}

export default function ApplicationModal({ info, opened, onClose, updateApplicationList }: Props) {
    const [isPending, setIsPending] = useState<boolean>(false)

    const { sendNotification } = useNotificationContext()
    const { giveUpApplication } = useUserSessionContext()

    const handleGiveUp = async (): Promise<void> => {
        if (isPending) return
        setIsPending(true)

        const res = await giveUpApplication(info!.vaga_id)

        if (res.ok) {
            sendNotification({ message: "Abandono de vaga concluído!", type: "Success" })
            setIsPending(false)

            return updateApplicationList()
        }

        sendNotification({ message: "Erro ao abandonar vaga!", type: "Error" })
        return setIsPending(false)
    }

    return (
        <Modal show={opened} onHide={onClose} centered size="lg" backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Sobre a vaga</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {info && (
                    <>
                        <span className="fs-4">{info.empresa_nome}</span>
                        <h2>{info.titulo}</h2>

                        <div className="d-flex gap-1">
                            <Badge
                                bg="light"
                                className="border text-success"
                                style={{ fontSize: "11px" }}
                            >
                                R$ {info.salario_minimo} - R$ {info.salario_maximo}
                            </Badge>

                            <Badge
                                bg="light"
                                className="border text-muted"
                                style={{ fontSize: "11px" }}
                            >
                                {vinculo[info.vinculo]}
                            </Badge>

                            <Badge
                                bg="light"
                                className="border text-muted"
                                style={{ fontSize: "11px" }}
                            >
                                {modalidade[info.modalidade]}
                            </Badge>
                        </div>

                        <div className="mt-5">
                            <h3>Descrição</h3>

                            <p style={{ whiteSpace: "pre-wrap" }}>
                                {info.vaga_descricao}
                            </p>
                        </div>

                        <div className="mt-5">
                            <h3>Requisitos</h3>

                            <p style={{ whiteSpace: "pre-wrap" }}>
                                {info.requisitos}
                            </p>
                        </div>

                        {![14, 15, 16].includes(info.statusCandidatura) && (
                            <div className="d-flex justify-content-end mt-5">
                                <Button className="btn-danger px-4" onClick={handleGiveUp}>Desistir</Button>
                            </div>
                        )}
                    </>
                )}
            </Modal.Body>
        </Modal>
    )
}