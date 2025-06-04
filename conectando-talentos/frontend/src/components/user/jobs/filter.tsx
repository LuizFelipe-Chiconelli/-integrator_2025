import { Form } from "react-bootstrap"

import TextInput from "../../all/textinput"
import Select from "../../all/select"

export default function JobFilters() {
    return (
        <Form className="row row-cols-1 row-cols-lg-2">
            <div className="col">
                <TextInput
                    bg="white"
                    controlId="filtroPesquisa"
                    label="Filtro"
                    placeholder="Pesquisar"
                />
            </div>

            <div className="col">
                <Select
                    bg="white"
                    controlId="filtroOrdem"
                    label="Ordem"
                    placeholder="Maior Salário"
                />
            </div>
        </Form>
    )
}