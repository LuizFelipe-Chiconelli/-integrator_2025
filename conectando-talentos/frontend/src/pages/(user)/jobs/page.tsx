import { Container } from "react-bootstrap"
import JobList from "@/components/sections/(user)/jobs/joblist"

export default function UserJobs() {
    return (
        <main className="w-100 d-flex flex-column justify-content-start align-items-center overflow-y-auto p-4">
            <Container className="bg-white border rounded-3 p-4 shadow-sm">
                <h1 className="fs-3 fw-bold m-0">Dados Pessoais</h1>
                <span>Preencha suas informações pessoais</span>

                <JobList />
            </Container>
        </main>
    )
}