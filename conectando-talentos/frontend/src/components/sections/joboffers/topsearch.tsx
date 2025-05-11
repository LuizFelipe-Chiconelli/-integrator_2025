import { Button, Container } from "react-bootstrap"

import "./topsearch.css"

export default function TopSearch() {
    return (
        <Container
            fluid
            className="bg-primary d-flex flex-column
            justify-content-center align-items-center py-5"
        >
            <h1 className="text-white fw-bold fs-3">Encontre a vaga perfeita para você!</h1>

            <div
                id="search-wrapper"
                className="bg-white d-flex rounded-4 gap-3 p-4"
            >
                <input
                    type="text"
                    className="rounded-3 border px-3 py-2"
                    placeholder="Cargo, palavra-chave ou empresa"
                    id="vaga-input"
                />
                <input
                    type="text"
                    className="rounded-3 border px-3"
                    placeholder="Localização"
                />
                <Button className="px-5">Buscar Vagas</Button>
            </div>
        </Container>
    )
}