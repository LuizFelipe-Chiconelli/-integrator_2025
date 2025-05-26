import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa";
import "./login-empresa.css";

export default function EmpresaLogin() {
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow p-4">
            {/* Logo & título */}
            <div className="text-center mb-4">
              <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                <FaInfoCircle size={25} className="text-dark" />
                <span className="logo-infojobs fs-4 fw-bold text-dark">InfoJobs</span>
              </div>

              <h4 className="fw-bold">Área da Empresa</h4>
              <p className="text-muted">
                Ou <a href="/empresa/register" className="text-primary fw-semibold">cadastre sua empresa</a>
              </p>
            </div>

            {/* Formulário */}
            <Form>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email Corporativo</Form.Label>
                <Form.Control type="email" placeholder="empresa@dominio.com" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formSenha">
                <Form.Label>Senha</Form.Label>
                <Form.Control type="password" placeholder="********" />
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Check type="checkbox" label="Lembrar-me" />
                <a href="#" className="text-primary text-decoration-none">Esqueceu a senha?</a>
              </div>

              <Button className="w-100" variant="primary">Entrar</Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
