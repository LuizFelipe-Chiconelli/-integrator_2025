import { Button, Container, Form } from "react-bootstrap"

export default function TopSearch() {
    return (
        <Container
            fluid
            className="bg-primary d-flex flex-column
            justify-content-center align-items-center py-5"
        >
            <h1 className="text-white fw-bold fs-3">Encontre a vaga perfeita para você!</h1>

            <div
                className="container-xl"
            >
                <Form
                    className="bg-white rounded-4 p-4"
                >
                    <div className="row gap-2 justify-content-center">

                        <Form.Group className="col-lg-6 mx-0 px-0" controlId="formVaga">
                            <Form.Control
                                type="text"
                                size="lg"
                                className="rounded-3 w-100 border fs-6"
                                placeholder="Cargo, palavra-chave ou empresa"
                            />
                        </Form.Group>

                        <Form.Group className="col-lg-3 mx-0 px-0" controlId="formLocal">
                            <Form.Control
                                type="text"
                                size="lg"
                                className="rounded-3 border fs-6"
                                placeholder="Localização"
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
            </div>
        </Container>
    )
}