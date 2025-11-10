'use client'

import { Container } from "react-bootstrap"

import ApplicationRow from "./row"
import ApplicationTable from "./table"
import ApplicationModal from "./modal"
import ApplicationFilters from "./filter"

import { useEffect, useState } from "react"
import { useUserSessionContext } from "@/_session/user/context"
import { useNotificationContext } from "@/components/notifications/context"

import type { Application } from "@/types/jobs"

export default function ApplicationSection() {
    const [applications, setApplications] = useState<Application[] | undefined>([])
    const [filters, setFilters] = useState<{ texto: string, status: "" | "11" | "12" | "13" | "14" }>({ texto: "", status: "" })

    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [selectedApplication, setSelectedApplication] = useState<Application | undefined>(undefined)

    const { sendNotification } = useNotificationContext()
    const { getApplicationList } = useUserSessionContext()

    const handleCloseModal = () => {
        setIsVisible(false)
    }

    const handleOpenModal = (info: Application) => {
        setSelectedApplication(info)
        setIsVisible(true)
    }

    const fetchApplications = async (): Promise<void> => {
        const res = await getApplicationList()

        if (res.ok) {
            console.log(res)
            return setApplications(res.applications)
        }

        sendNotification({ message: "Erro ao buscar candidaturas!", type: "Error" })
    }

    useEffect(() => {
        fetchApplications()
    }, [])

    return (
        <Container className="bg-white border rounded-3 p-4 shadow-sm">
            <h1 className="fs-3 fw-bold m-0">Candidaturas</h1>
            <span>Vagas para as quais você aplicou</span>

            <Container className="mt-4">
                <ApplicationFilters onChange={setFilters} value={filters} />

                <ApplicationTable>
                    {applications && applications.map((info) => (
                        <ApplicationRow key={info.vaga_id} info={info} onClick={() => handleOpenModal(info)} />
                    ))}
                </ApplicationTable>
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