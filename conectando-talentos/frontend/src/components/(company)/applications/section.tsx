'use client'

import { Alert, Container } from "react-bootstrap"

import ApplicationRow from "./row"
import ApplicationTable from "./table"
import ApplicationModal from "./modal"
import ApplicationFilters from "./filter"

import { useEffect, useState } from "react"
import { useCompanySessionContext } from "@/_session/company/context"
import { useNotificationContext } from "@/components/notifications/context"

import type { CandidateApplication, Job } from "@/types/jobs"

export default function ApplicationSection() {
    const [vacancies, setVacancies] = useState<Job[] | undefined>([])
    const [applications, setApplications] = useState<CandidateApplication[] | undefined>(undefined)

    const [filters, setFilters] = useState<{ name: string, vacancy: string }>({ name: "", vacancy: "" })

    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [selectedApplication, setSelectedApplication] = useState<CandidateApplication | undefined>(undefined)

    const { sendNotification } = useNotificationContext()
    const { getJobVacancies, getApplicationList } = useCompanySessionContext()

    const handleCloseModal = () => {
        setIsVisible(false)
    }

    const handleOpenModal = (info: CandidateApplication) => {
        setSelectedApplication(info)
        setIsVisible(true)
    }

    const fetchJobVacancies = async (): Promise<void> => {
        const res = await getJobVacancies()

        if (res.ok) {
            return setVacancies(res.vacancies)
        }

        return sendNotification({ message: "Erro ao buscar vagas!", type: "Error" })
    }

    const fetchApplications = async (): Promise<void> => {
        const res = await getApplicationList(Number(filters.vacancy))

        if (res.ok) {
            console.log(res)
            return setApplications(res.applications)
        }

        sendNotification({ message: "Erro ao buscar candidaturas!", type: "Error" })
    }

    useEffect(() => {
        fetchJobVacancies()
    }, [])

    useEffect(() => {
        if (filters.vacancy !== "") {
            fetchApplications()
        } else { }
    }, [filters.vacancy])

    return (
        <Container className="bg-white border rounded-3 p-4 shadow-sm">
            <h1 className="fs-3 fw-bold m-0">Candidaturas</h1>
            <span>Todas as candidaturas das suas vagas</span>

            <Container className="mt-4">
                <ApplicationFilters vacancies={vacancies || []} onChange={setFilters} value={filters} />

                {filters.vacancy ? (
                    <ApplicationTable>
                        {applications && applications.map((info) => (
                            <ApplicationRow key={info.vaga_id} info={info} onClick={() => handleOpenModal(info)} />
                        ))}
                    </ApplicationTable>
                ) : (
                    <Alert variant="warning">Selecione uma vaga</Alert>
                )}
            </Container>

            <ApplicationModal
                info={selectedApplication}
                opened={isVisible}
                onClose={handleCloseModal}
                updateApplicationList={fetchApplications}
            />
        </Container>
    )
}