import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa";
import "./register-empresa.css";

export default function EmpresaRegister() {
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow p-4">
            {/* Cabeçalho */}
            <div className="text-center mb-4">
              <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                <FaInfoCircle size={25} className="text-dark" />
                <span className="logo-infojobs fs-4 fw-bold text-dark">InfoJobs</span>
              </div>

              <h4 className="fw-bold">Cadastre sua empresa</h4>
              <p className="text-muted">
                Já tem uma conta? <a href="/empresa/login" className="fw-semibold">Faça login</a>
              </p>

              {/* Indicador de etapas */}
              <div className="d-flex justify-content-center align-items-center step-indicator mb-3">
                <div className="step active">1</div>
                <div className="line" />
                <div className="step">2</div>
              </div>
            </div>

            {/* Formulário */}
            <Form>
              <Form.Group className="mb-3" controlId="formNomeEmpresa">
                <Form.Label>Nome da Empresa *</Form.Label>
                <Form.Control type="text" placeholder="Nome da sua empresa" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formCNPJ">
                <Form.Label>CNPJ *</Form.Label>
                <Form.Control type="text" placeholder="00.000.000/0000-00" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formSetor">
                <Form.Label>Setor de Atuação *</Form.Label>
                <Form.Select>
                  <option>Selecione</option>
                  <option>Comércio</option>
                  <option>Serviços</option>
                  <option>Indústria</option>
                  <option>Outros</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4" controlId="formDescricao">
                <Form.Label>Descrição da Empresa</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Conte um pouco sobre sua empresa..." />
              </Form.Group>

              <Button className="w-100" variant="primary">Continuar</Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
