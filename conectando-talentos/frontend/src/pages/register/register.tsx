import { Container, Row, Col, Form, Button, Card  } from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa";

export default function Register() {
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow p-4">
            <div className="text-center mb-4">
             
              <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
                  <FaInfoCircle size={25} className="text-dark" />
                  <span className="logo-infojobs text-dark fs-3">InfoJobs</span>
                </div>

              <h4 className="fw-bold">Crie sua conta</h4>
              <p className="text-muted">
                Já tem uma conta? <a href="/login" className="text-primary">Faça login</a>
              </p>
            </div>

            <Form>
              <Form.Group controlId="formNome" className="mb-3">
                <Form.Label>Nome Completo</Form.Label>
                <Form.Control type="text" placeholder="Seu nome completo" />
              </Form.Group>

              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="seu@email.com" />
              </Form.Group>

              <Form.Group controlId="formSenha" className="mb-3">
                <Form.Label>Senha</Form.Label>
                <Form.Control type="password" placeholder="********" />
              </Form.Group>

              <Form.Group controlId="formConfirmarSenha" className="mb-4">
                <Form.Label>Confirmar Senha</Form.Label>
                <Form.Control type="password" placeholder="********" />
              </Form.Group>

              <Button variant="primary" className="w-100">
                Continuar
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
