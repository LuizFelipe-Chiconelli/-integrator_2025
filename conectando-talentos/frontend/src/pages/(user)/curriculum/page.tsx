import { Container } from "react-bootstrap"

import UploadSection from "../../../components/sections/(user)/curriculum/upload"
import EducationSection from "../../../components/sections/(user)/curriculum/education"
import ExperienceSection from "../../../components/sections/(user)/curriculum/experience"
import QualificationSection from "../../../components/sections/(user)/curriculum/qualification"

export default function Curriculum() {
    return (
        <main
            className="w-100 d-flex flex-column justify-content-start align-items-center overflow-y-auto p-4"
        >
            <Container className="d-flex flex-column gap-3 p-0">
                <h1 className="fs-3 fw-bold mb-0 ms-2">Meu Currículo</h1>

                <UploadSection />
                <EducationSection />
                <ExperienceSection />
                <QualificationSection />
            </Container>
        </main>
    )
}