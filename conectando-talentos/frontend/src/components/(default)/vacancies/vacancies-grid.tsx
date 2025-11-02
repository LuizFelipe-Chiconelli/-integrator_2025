import { Container } from "react-bootstrap"

import VacanciesFilter from "./filter"
import JobCard from "../jobs/job-card"
import CardPlaceholder from "../jobs/card-placeholder"
import PaginationButtons from "@/components/all/pagination"

import type { Job } from "@/types/jobs"

// Hooks
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

// Actions
import { getJobs } from "@/actions/default/jobs"

export default function VacanciesGrid() {
    const [searchParams] = useSearchParams()
    const [jobs, setJobs] = useState<Array<Job> | null>(null)

    // Função que busca e seta as vagas de empregos
    async function fetchJobs() {
        const page: string = String(searchParams.get("page"))

        const res: Array<Job> = await getJobs(page == "" ? page : "1")
        setJobs(res.slice(0, 9))
    }

    // Ação a realizar sempre que os parametros de pesquisa mudarem
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' }) // Scrollar tela para o topo
        setJobs(null) // Remover valores para mostrar os placeholder
        fetchJobs() // Pesquisar e setar novos valores
    }, [searchParams])

    return (
        <Container fluid="md" className="row d-flex justify-content-center mt-5">
            <div className="col-lg-3 mb-lg-0 mb-5">
                <div className="sticky-lg-top">
                    <VacanciesFilter />
                </div>
            </div>

            <Container className="col">
                <div className="d-flex flex-column">
                    <h2 className="fw-bold">Vagas disponíveis</h2>
                </div>

                <div className="row mt-2 row-gap-4">
                    {jobs && jobs.map((job: Job) => {
                        return (
                            <div className="col-lg-4 px-1" key={job.vaga_id}>
                                <JobCard job={job} />
                            </div>
                        )
                    })}

                    {/* Placeholders */}
                    {!jobs && (
                        <>
                            <div className="col-lg-4 px-1"><CardPlaceholder /></div>
                            <div className="col-lg-4 px-1"><CardPlaceholder /></div>
                            <div className="col-lg-4 px-1"><CardPlaceholder /></div>
                        </>
                    )}

                    {jobs && jobs.length < 1 && (
                        <span className="fs-4">Nenhuma vaga encontrada!</span>
                    )}
                </div>

                <PaginationButtons />
            </Container>
        </Container>
    )
}