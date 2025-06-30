import { Container } from "react-bootstrap"

import ApplicationTable from "@/components/user/applications/table"
import PaginationButtons from "@/components/all/pagination"

import Select from "@/components/all/select"
import TextInput from "@/components/all/textinput"

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
                    controlId="filtroStatus"
                    label="Filtrar por Status"
                    options={[ { id: "null", displayName: "Selecione" } ]}
                />
            </div>

            <Container fluid className="border rounded-2 m-0 p-1">
                <ApplicationTable />
            </Container>

            <PaginationButtons />
        </Container>
    )
}