import { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa";
import "./register-empresa.css";

export default function EmpresaRegister() {
  const [step, setStep] = useState(1);

  const goNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };
  const goBack = () => setStep(1);

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
                <div className={`step ${step === 1 ? "active" : ""}`}>1</div>
                <div className="line" />
                <div className={`step ${step === 2 ? "active" : ""}`}>2</div>
              </div>
            </div>

            {/* Etapa 1 */}
            {step === 1 && (
              <Form onSubmit={goNext}>
                <Form.Group className="mb-3" controlId="formNomeEmpresa">
                  <Form.Label>Nome da Empresa *</Form.Label>
                  <Form.Control type="text" placeholder="Nome da sua empresa" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCNPJ">
                  <Form.Label>CNPJ *</Form.Label>
                  <Form.Control type="text" placeholder="00.000.000/0000-00" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formSetor">
                  <Form.Label>Setor de Atuação *</Form.Label>
                  <Form.Select required>
                    <option value="">Selecione</option>
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

                <Button type="submit" className="w-100" variant="primary">Continuar</Button>
              </Form>
            )}

            {/* Etapa 2 */}
            {step === 2 && (
              <Form>
                <Form.Group className="mb-3" controlId="formEmailCorp">
                  <Form.Label>Email Corporativo *</Form.Label>
                  <Form.Control type="email" placeholder="empresa@dominio.com" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formSenha">
                  <Form.Label>Senha *</Form.Label>
                  <Form.Control type="password" placeholder="********" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formConfirmaSenha">
                  <Form.Label>Confirmar Senha *</Form.Label>
                  <Form.Control type="password" placeholder="********" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formTelefone">
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control type="text" placeholder="(00) 0000-0000" />
                </Form.Group>

                <Form.Check className="mb-4" label="Eu aceito os Termos de Serviço e a Política de Privacidade" required />

                <div className="d-flex gap-2">
                  <Button variant="outline-secondary" className="w-50" onClick={goBack}>Voltar</Button>
                  <Button variant="primary" className="w-50">Cadastrar Empresa</Button>
                </div>
              </Form>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
