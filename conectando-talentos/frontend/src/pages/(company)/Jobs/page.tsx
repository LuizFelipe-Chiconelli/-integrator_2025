import { Container } from "react-bootstrap"

import JobList from "@/components/sections/(company)/jobs/joblist"

export default function CompanyJobs() {
    return (
        <main className="w-100 d-flex flex-column justify-content-start align-items-center overflow-y-auto p-4" >
            <Container className="bg-white border rounded-3 p-4 shadow-sm">
                <h1 className="fs-3 fw-bold m-0">Vagas da Empresa</h1>
                <span>Gerencie as vagas postadas por sua empresa</span>

                <JobList />
            </Container>
        </main >
    )
}
