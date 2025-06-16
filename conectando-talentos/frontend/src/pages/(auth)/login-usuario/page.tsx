import { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FaGoogle, FaFacebook, FaInfoCircle } from "react-icons/fa";
import axios, { AxiosError } from "axios";
import "./login-usuario.css";

const API_URL = "http://integrador/usuario/login";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(API_URL, {
        email,
        senha
      });

      alert(data.mensagem);

      // salva login no localStorage
      localStorage.setItem("usuario_id", data.usuario.id);
      localStorage.setItem("usuario_tipo", data.usuario.tipo);
      localStorage.setItem("usuario_email", data.usuario.email);

      // redireciona para o dashboard
      window.location.href = "/";

    } catch (err: unknown) {
      let msg = "Erro ao tentar logar.";
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ mensagem?: string }>;
        msg = axiosErr.response?.data?.mensagem ?? msg;
      }
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow p-4">
            <div className="text-center mb-4">
              <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
                <FaInfoCircle size={25} className="text-dark" />
                <span className="logo-infojobs text-dark fs-3">InformJobs</span>
              </div>

              <h5 className="mt-3 fw-bold">Entre na sua conta</h5>
              <p className="text-muted mb-0">
                Ou <a href="/register">crie uma conta gratuita</a>
              </p>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formSenha" className="mb-3">
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="********"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Check type="checkbox" label="Lembrar-me" />
                <a href="#" className="text-primary text-decoration-none">
                  Esqueceu a senha?
                </a>
              </div>

              <Button className="w-100 mb-3" variant="primary" type="submit" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
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
  );
}
