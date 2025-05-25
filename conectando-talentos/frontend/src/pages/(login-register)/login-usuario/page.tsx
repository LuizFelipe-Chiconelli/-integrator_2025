import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FaGoogle, FaFacebook, FaInfoCircle } from "react-icons/fa";
import "./login-usuario.css";

export default function Login() {
  return (
    <>
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Row className="w-100 justify-content-center">
          <Col md={6} lg={4}>
            <Card className="shadow p-4">
              <div className="text-center mb-4">
                <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
                  <FaInfoCircle size={25} className="text-dark" />
                  <span className="logo-infojobs text-dark fs-3">InfoJobs</span>
                </div>


                <h5 className="mt-3 fw-bold">Entre na sua conta</h5>
                <p className="text-muted mb-0">
                  Ou <a href="#">crie uma conta gratuita</a>
                </p>
              </div>

              <Form>
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="seu@email.com" />
                </Form.Group>

                <Form.Group controlId="formSenha" className="mb-3">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control type="password" placeholder="********" />
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Form.Check type="checkbox" label="Lembrar-me" />
                  <a href="#" className="text-primary text-decoration-none">
                    Esqueceu a senha?
                  </a>
                </div>

                <Button className="w-100 mb-3" variant="primary">
                  Entrar
                </Button>

                <div className="text-center text-muted mb-3">Ou continue com</div>

                <div className="d-flex gap-2 justify-content-center">
                  <Button variant="light" className="border">
                    <FaGoogle className="me-2" /> Google
                  </Button>
                  <Button variant="light" className="border">
                    <FaFacebook className="me-2" /> Facebook
                  </Button>
                </div>
              </Form>

            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
