"use client"

// Actions
import { getSingleVacancy } from "@/actions/default/jobs"

// Hooks
import { useState, useEffect } from "react"

// Tipos
import type { Job } from "@/types/jobs"

import { apply, isSignedIn } from "@/actions/user/user"
import { Button, Container } from "react-bootstrap"
import { useNotificationContext } from "@/components/notifications/context"

import Banner from "./banner"
import { useNavigate } from "react-router-dom"

interface Props {
    id: string
}

export default function VacancyInfo({ id }: Props) {
    const navigate = useNavigate()

    const [job, setJob] = useState<Job | null>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isPending, setIsPending] = useState<boolean>(false)

    const { sendNotification } = useNotificationContext()

    const fetchJob = async (): Promise<void> => {
        const res: Job | null = await getSingleVacancy(id)
        setJob(res)
    }

    const handleApply = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        e.preventDefault()

        if (isPending) return
        setIsPending(true)

        if (!isSignedIn()) {
            return navigate("/auth/login-usuario")
        }

        const res = await apply(job!.vaga_id)

        if (res.ok) {
            sendNotification({ message: "Candidatura realizada com sucesso!", type: "Success" })
            setIsPending(false)

            return navigate("/usuario/candidaturas")
        }

        sendNotification({ message: res.message!, type: "Error" })
        return setIsPending(false)
    }

    useEffect(() => {
        if (!isLoading) setIsLoading(true)
        fetchJob().then(() => setIsLoading(false))
    }, [])

    return (
        <>
            {job && (
                <>
                    <Banner />

                    <Container className="mt-5">
                        <span className="fs-4">{job.empresa_nome}</span>
                        <h2>{job.titulo}</h2>

                        <div className="mt-5">
                            <h3>Descrição</h3>

                            <p>{job.descricao}</p>
                        </div>

                        <div className="mt-5">
                            <h3>Requisitos</h3>

                            <p style={{ whiteSpace: "pre-wrap" }}>
                                {job.requisitos}
                            </p>
                        </div>

                        <div className="mt-5">
                            <Button onClick={handleApply} className="px-4">Candidatar-se</Button>
                        </div>
                    </Container>
                </>
            )}

            {(!isLoading && !job) && (
                <Container className="d-flex flex-column align-items-center py-5">
                    <img
                        src="/undraw-404.svg"
                        alt="Imagem de erro 404"
                        className="w-50"
                    />
                    <h1 className="fw-bold text-dark-emphasis mt-3">Vaga não encontrada</h1>
                </Container>
            )}
        </>
    )
}