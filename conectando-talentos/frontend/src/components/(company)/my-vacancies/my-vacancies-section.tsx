"use client"

import { useEffect, useState } from "react"
import { Container } from "react-bootstrap"
import { useCompanySessionContext } from "@/_session/company/context"

import type { Job } from "@/types/jobs"

import VacancyCard from "./card"
import VacancyFilters from "./filter"
import VacancyModal from "./modal"

export default function MyVacanciesSection() {
    const [vacancies, setVacancies] = useState<Job[] | undefined>(undefined)
    const [filters, setFilters] = useState<{ texto: string, status: "" | "11" | "12" | "13" | "14" }>({ texto: "", status: "" })

    const [modalOpened, setModalOpened] = useState<boolean>(false)
    const [selectedVacancy, setSelectedVacancy] = useState<Job | undefined>(undefined)

    const { getJobVacancies } = useCompanySessionContext()

    const fetchVacancies = async (): Promise<void> => {
        const res = await getJobVacancies()

        if (res.ok) {
            return setVacancies(res.vacancies)
        }

        return setVacancies([])
    }

    const handleOpenModal = (info: Job): void => {
        setSelectedVacancy(info)
        setModalOpened(true)
    }

    const handleCloseModal = (): void => {
        setModalOpened(false)
        setSelectedVacancy(undefined)
    }

    useEffect(() => {
        fetchVacancies()
    }, [filters])

    return (
        <Container className="bg-white border rounded-3 p-4 shadow-sm">
            <h1 className="fs-3 fw-bold m-0">Vagas da Empresa</h1>
            <span>Gerencie suas vagas de trabalho</span>

            <Container className="mt-4">
                <VacancyFilters value={filters} onChange={setFilters} />
            </Container>

            <Container className="mt-4">
                {vacancies?.map((v) => (
                    <VacancyCard key={v.vaga_id} info={v} openModal={handleOpenModal} />
                ))}
            </Container>

            <VacancyModal info={selectedVacancy} opened={modalOpened} onClose={handleCloseModal} updateVacancyList={fetchVacancies} />
        </Container>
    )
}
