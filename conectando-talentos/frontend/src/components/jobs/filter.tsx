import { Button, Container, Form } from "react-bootstrap"

export default function JobsFilter() {
    return (
        <Container className="border rounded-3 p-3">
            <h3 className="fw-bold mb-3">Filtros</h3>

            <Form className="d-flex flex-column gap-3 mb-3">
                <Form.Group controlId="formTipo">
                    <Form.Label className="fs-6 fw-semibold">Tipo de Vaga</Form.Label>
                    <Form.Select>
                        <option value="Todos">Todos</option>
                        <option value="Tempo Integral">Tempo Integral</option>
                        <option value="Meio Periodo">Meio Periodo</option>
                        <option value="Remoto">Remoto</option>
                        <option value="Freelancer">Freelancer</option>
                        <option value="Estágio">Estágio</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="formExp">
                    <Form.Label className="fs-6 fw-semibold">Nível de Experiência</Form.Label>
                    <Form.Select>
                        <option value="Todos">Todos</option>
                        <option value="Júnior/Trainee">Júnior/Trainee</option>
                        <option value="Pleno">Pleno</option>
                        <option value="Senior">Senior</option>
                        <option value="Gerente/Diretor">Gerente/Diretor</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="formSalario">
                    <Form.Label className="fs-6 fw-semibold">Faixa Salarial (R$)</Form.Label>
                    <Form.Range  />

                    <div className="d-flex justify-content-between">
                        <span>R$ 0</span>
                        <span>R$ 15000</span>
                    </div>
                </Form.Group>

                <Button>Filtrar</Button>
            </Form>
        </Container>
    )
}