import { Container } from "react-bootstrap"

import UploadSection from "../../../components/sections/(user)/curriculum/upload"
import EducationSection from "../../../components/sections/(user)/curriculum/education"

export default function Curriculum() {
    return (
        <main className="w-100 d-flex flex-column justify-content-start align-items-center overflow-y-auto p-4">
            <Container className="p-0">
                <h1 className="fs-3 fw-bold mb-1 ms-2">Meu Currículo</h1>

                <UploadSection />
                <EducationSection />
            </Container>
        </main>
    )
}