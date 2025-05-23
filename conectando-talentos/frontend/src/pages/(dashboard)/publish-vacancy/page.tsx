import { Container } from "react-bootstrap"
import VacancyForm from "../../../components/sections/vacancyform/vacancyform"

export default function PublishVacancy() {
    return (
        <main className="w-100 d-flex flex-column justify-content-start align-items-center overflow-y-auto p-4">
            <Container fluid className="bg-white border rounded-3 p-4">
                <h1 className="fs-3 fw-bold m-0">Publicar Nova Vaga</h1>
                <span>Preencha os detalhes da vaga que você deseja publicar</span>

                <VacancyForm />
            </Container>
        </main>
    )
}