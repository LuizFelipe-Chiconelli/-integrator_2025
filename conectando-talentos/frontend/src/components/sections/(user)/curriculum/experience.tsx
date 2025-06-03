import { Button, Container } from "react-bootstrap"

import { FaPlus } from "react-icons/fa6"

import ExperienceForm from "../../../user/curriculum/forms/experience"

export default function ExperienceSection() {
    return (
        <Container className="bg-white border rounded-3 p-4 shadow-sm">
            <div className="row row-cols-lg-2 justify-content-between">
                <div>
                    <h2 className="fs-3 fw-bold m-0">Experiência Profissional</h2>
                    <span>Liste empregos/estágios anteriores</span>
                </div>

                <div className="d-flex justify-content-lg-end align-items-start">
                    <Button className="d-flex align-items-center gap-1">
                        <FaPlus /> Adicionar
                    </Button>
                </div>
            </div>

            <ExperienceForm />
        </Container>
    )
}