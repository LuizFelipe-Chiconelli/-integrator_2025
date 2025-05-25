import { Container } from "react-bootstrap"

import ApplicationTable from "../../../applications/company/table"
import PaginationButtons from "../../../all/pagination"

import Select from "../../../all/select"
import TextInput from "../../../all/textinput"

export default function ApplicationsGrid() {
    return (
        <Container fluid className="p-0 mt-4">
            <div className="row row-cols-2">
                <TextInput
                    controlId="filtroNome"
                    label="Filtrar por nome"
                    placeholder="Pesquisar nome de candidato"
                />
                <Select
                    controlId="filtroVaga"
                    label="Filtrar por Vaga"
                    placeholder="Select"
                />
            </div>

            <Container fluid className="border rounded-2 m-0 p-1">
                <ApplicationTable />
            </Container>

            <PaginationButtons />
        </Container>
    )
}