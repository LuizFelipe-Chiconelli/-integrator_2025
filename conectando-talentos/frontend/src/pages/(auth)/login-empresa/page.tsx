'use client';

import { useState, type FormEvent, type ChangeEvent } from 'react';
import {
  Container, Row, Col, Card, Form, Button, Spinner
} from 'react-bootstrap';
import { FaInfoCircle } from 'react-icons/fa';
import axios, { AxiosError } from 'axios';
import './login-empresa.css';

const API_URL = 'http://integrador/empresa/login';

export default function EmpresaLogin() {
  const [form, setForm] = useState({ email: '', senha: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(API_URL, form, { withCredentials: true });

      // guarda info leve no localStorage (apenas para UI)
      localStorage.setItem('empresa_nome', data.empresa.nome);

      // redireciona para dashboard
      window.location.href = '/minha-empresa';
    }
    catch (err) {
      const msg = axios.isAxiosError(err)
        ? (err as AxiosError<{mensagem?:string}>).response?.data?.mensagem
          ?? 'Erro ao tentar logar.'
        : 'Erro ao tentar logar.';
      alert(msg);
    }
    finally { setLoading(false); }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow p-4">
            <header className="text-center mb-4">
              <div className="d-flex justify-content-center gap-2 mb-2">
                <FaInfoCircle size={25} className="text-dark"/>
                <span className="logo-infojobs fs-4 fw-bold text-dark">InformJobs</span>
              </div>
              <h4 className="fw-bold mb-0">Área da Empresa</h4>
              <small className="text-muted">
                Ou&nbsp;
                <a href="/auth/register-empresa" className="fw-semibold">cadastre sua empresa</a>
              </small>
            </header>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email Corporativo</Form.Label>
                <Form.Control type="email" name="email" required
                              value={form.email} onChange={handleChange}
                              placeholder="empresa@dominio.com"/>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Senha</Form.Label>
                <Form.Control type="password" name="senha" required
                              value={form.senha} onChange={handleChange}
                              placeholder="********"/>
              </Form.Group>

              <Button type="submit" className="w-100" variant="primary" disabled={loading}>
                {loading
                  ? <><Spinner size="sm"/> Entrando…</>
                  : 'Entrar'}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
