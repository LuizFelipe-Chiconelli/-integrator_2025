import { Container } from "react-bootstrap"

import ApplicationsGrid from "../../../components/sections/applications/company/applications"

export default function Application() {
    return (
        <main className="w-100 d-flex flex-column justify-content-start align-items-center overflow-y-auto p-4">
            <Container fluid className="bg-white border rounded-3 p-4 shadow-sm">
                <h1 className="fs-3 fw-bold m-0">Candidaturas</h1>
                <span>Gerencie as candidaturas para as vagas da sua empresa</span>

                <ApplicationsGrid />
            </Container>
        </main>
    )
}