import { Button, Container, Form } from "react-bootstrap"

export default function TopSearch() {
    return (
        <Container
            fluid
            className="bg-primary
            justify-content-center align-items-center py-5"
        >
            <div className="d-flex flex-column align-items-center">
                <h1 className="text-white fw-bold fs-3">Encontre a vaga perfeita para você!</h1>

                <Container>
                    <Form
                        className="bg-white rounded-4 p-4"
                    >
                        <div className="row gap-2 justify-content-center">

                            <Form.Group className="col-lg-9 mx-0 px-0" controlId="formVaga">
                                <Form.Control
                                    type="text"
                                    size="lg"
                                    className="rounded-3 w-100 border fs-6"
                                    placeholder="Cargo, palavra-chave ou empresa"
                                />
                            </Form.Group>

                            <div className="col-lg-2 mx-0 px-0">
                                <Button
                                    id="searchButton"
                                    className="w-100 fs-6"
                                    style={{ height: "42px" }}
                                >
                                    Buscar Vagas
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Container>
            </div>
        </Container>
    )
}