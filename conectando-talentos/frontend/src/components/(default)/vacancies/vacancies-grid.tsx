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
    const [page, setPage] = useState<number>(1)
    const [maxPages, setMaxPages] = useState<number>(1)
    const [jobs, setJobs] = useState<Array<Job> | null>(null)
    const [filteredJobs, setFilteredJobs] = useState<Array<Job> | null>(null)

    const MAX_PER_PAGE: number = 9

    // Função que busca e seta as vagas de empregos
    const fetchJobs = async () => {
        const res: Array<Job> = await getJobs()
        setJobs(res)
    }

    // Mudança de página
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' }) // Scrollar tela para o topo

        if (jobs) {
            const offset: number = 1 * (page - 1)

            setMaxPages(Math.ceil(jobs.length / MAX_PER_PAGE))
            setFilteredJobs(jobs.slice(offset, (offset + MAX_PER_PAGE)))
        }
    }, [jobs, page])

    // Ação a realizar sempre que os parametros de pesquisa mudarem
    useEffect(() => {
        setPage(1)

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
                    {filteredJobs && filteredJobs.map((job: Job) => {
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

                    {filteredJobs && filteredJobs.length < 1 && (
                        <span className="fs-4">Nenhuma vaga encontrada!</span>
                    )}
                </div>

                <PaginationButtons maxPages={maxPages} page={page} setPage={setPage} />
            </Container>
        </Container>
    )
}