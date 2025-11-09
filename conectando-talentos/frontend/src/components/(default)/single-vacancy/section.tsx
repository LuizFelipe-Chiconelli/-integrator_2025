// Actions
import { getSingleVacancy } from "@/actions/default/jobs"

// Hooks
import { useState, useEffect } from "react"

// Tipos
import type { Job } from "@/types/jobs"

import { Button, Container } from "react-bootstrap"

import Banner from "./banner"

interface Props {
    id: string
}

export default function VacancyInfo({ id }: Props) {
    const [job, setJob] = useState<Job | null>()
    const [isLoading, setIsLoading] = useState<boolean>(true)

    // const skills: Array<string> = job ? JSON.parse(job.qualifications) : null

    const fetchJob = async (): Promise<void> => {
        const res: Job | null = await getSingleVacancy(id)
        // setJob(res)
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
                        <h2>{job.titulo}</h2>
                        <span className="fs-4">{job.empresa_nome}</span>

                        <div className="mt-5">
                            <h3>Descrição</h3>

                            <p>{job.descricao}</p>
                        </div>

                        <div className="mt-5">
                            <h3>Suas atividades na empresa</h3>

                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse tenetur a error, distinctio officia similique rem dolorem dolore molestiae voluptate id minima obcaecati consectetur sunt ipsum laboriosam inventore accusantium architecto.</p>
                        </div>

                        <div className="mt-5">
                            <h3>Requisitos</h3>

                            <p>
                                {job.requisitos}
                            </p>
                        </div>

                        <div className="mt-5">
                            <Button className="px-4">Candidatar-se</Button>
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