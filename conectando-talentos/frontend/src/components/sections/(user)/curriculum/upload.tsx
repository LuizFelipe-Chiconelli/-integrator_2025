import { Container } from "react-bootstrap"

import UploadCurriculumForm from "../../../user/curriculum/forms/upload"

export default function UploadSection() {
    return (
        <Container className="bg-white border rounded-3 p-4 shadow-sm">
            <h2 className="fs-3 fw-bold m-0">Upload de Currículo</h2>
            <span>Carregue seu currículo em PDF ou baixe o atual</span>

            <UploadCurriculumForm />
        </Container>
    )
}