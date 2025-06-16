import { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa";
import axios, { AxiosError } from "axios";

/** URL base do back-end */
const API_URL = "http://integrador/usuario/cadastrar";

export default function Register() {
  /* ---------- estado do formulário ---------- */
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: ""
  });

  /* ---------- checkbox do termo ---------- */
  const [aceite, setAceite] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.senha !== form.confirmarSenha) {
      alert("As senhas não conferem!");
      return;
    }

    try {
      const { data } = await axios.post(API_URL, {
        nome:   form.nome,
        email:  form.email,
        senha:  form.senha,
        aceite
      });

      alert(data.mensagem);
      /* limpa o formulário */
      setForm({ nome: "", email: "", senha: "", confirmarSenha: "" });
      setAceite(false);

    } catch (err: unknown) {
      /* erro vindo do Axios */
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ mensagem?: string }>;
        const msg =
          axiosErr.response?.data?.mensagem ??
          "Erro inesperado ao cadastrar.";
        alert(msg);
      } else {
        /* outro tipo de falha (JS, rede, etc.) */
        alert("Erro inesperado. Tente novamente.");
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow p-4">
            {/* ---------- cabeçalho ---------- */}
            <div className="text-center mb-4">
              <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
                <FaInfoCircle size={25} className="text-dark" />
                <span className="logo-infojobs text-dark fs-3">InformJobs</span>
              </div>
              <h4 className="fw-bold">Crie sua conta</h4>
              <p className="text-muted">
                Já tem uma conta?{" "}
                <a href="/login" className="text-primary">
                  Faça login
                </a>
              </p>
            </div>

            {/* ---------- formulário ---------- */}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formNome" className="mb-3">
                <Form.Label>Nome Completo</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Seu nome completo"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="seu@email.com"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formSenha" className="mb-3">
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="********"
                  name="senha"
                  value={form.senha}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formConfirmarSenha" className="mb-3">
                <Form.Label>Confirmar Senha</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="********"
                  name="confirmarSenha"
                  value={form.confirmarSenha}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Check
                type="checkbox"
                id="aceiteTermo"
                className="mb-4"
                label={
                  <>
                    Li e aceito o{" "}
                    <a
                      href="/termo.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Termo de Uso
                    </a>
                  </>
                }
                checked={aceite}
                onChange={e => setAceite(e.target.checked)}
              />

              <Button
                type="submit"
                variant="primary"
                className="w-100"
                disabled={!aceite}
              >
                Continuar
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
