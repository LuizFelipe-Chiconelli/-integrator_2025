import { Button, Container, Form } from "react-bootstrap"

import "./topsearch.css"

export default function TopSearch() {
    return (
        <Container
            fluid
            className="bg-primary d-flex flex-column
            justify-content-center align-items-center py-5"
        >
            <h1 className="text-white fw-bold fs-3">Encontre a vaga perfeita para você!</h1>

            <Form
                className="bg-white d-flex align-items-center justify-content-center rounded-4 gap-3 p-4"
            >
                <Form.Group className="w-100" controlId="formVaga">
                    <Form.Control
                        type="text"
                        size="lg"
                        className="rounded-3 border fs-6"
                        placeholder="Cargo, palavra-chave ou empresa"
                    />
                </Form.Group>

                <Form.Group className="w-100" controlId="formLocal">
                    <Form.Control
                        type="text"
                        size="lg"
                        className="rounded-3 border fs-6"
                        placeholder="Localização"
                    />
                </Form.Group>

                <Button
                    id="searchButton"
                    className="w-100 fs-6"
                >
                    Buscar Vagas
                </Button>
            </Form>
        </Container>
    )
}