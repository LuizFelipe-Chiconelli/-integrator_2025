import { Button, Container } from "react-bootstrap"

import { FaPlus } from "react-icons/fa6"

import EducationForm from "../../../user/curriculum/forms/education"

export default function EducationSection() {
    return (
        <Container className="bg-white border rounded-3 p-4 mt-4 shadow-sm">
            <div className="row row-cols-lg-2 justify-content-between">
                <div>
                    <h2 className="fs-3 fw-bold m-0">Escolaridade</h2>
                    <span>Registre cada nível/curso concluído ou em andamento</span>
                </div>

                <div className="d-flex justify-content-lg-end align-items-start">
                    <Button className="d-flex align-items-center gap-1">
                        <FaPlus /> Adicionar
                    </Button>
                </div>
            </div>

            <EducationForm />
        </Container>
    )
}