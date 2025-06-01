'use client';

import { useState, type FormEvent, type ChangeEvent } from 'react';
import {
  Container, Row, Col, Card, Form, Button, Spinner
} from 'react-bootstrap';
import { FaInfoCircle } from 'react-icons/fa';
import axios, { AxiosError } from 'axios';
import './register-empresa.css';

/* ─── endpoint do back-end ─── */
const API_URL = 'http://integrador/empresa/cadastrar';

/* ─── tipos dos formulários ─── */
interface FormEtapa1 {
  nome_fantasia: string;
  cnpj: string;
  categoria_id: string;
  descricao: string;
  endereco: string;
}
interface FormEtapa2 {
  email: string;
  senha: string;
  confirmarSenha: string;
  telefone: string;
}

export default function EmpresaRegister() {
  /* wizard step */
  const [step, setStep] = useState<1 | 2>(1);

  /* estados separados por etapa */
  const [f1, setF1] = useState<FormEtapa1>({
    nome_fantasia:'', cnpj:'', categoria_id:'', descricao:'', endereco:''
  });
  const [f2, setF2] = useState<FormEtapa2>({
    email:'', senha:'', confirmarSenha:'', telefone:''
  });
  const [loading, setLoading] = useState(false);

  /* handlers genéricos */
  const onF1 = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF1({ ...f1, [e.target.name]: e.target.value });

  const onF2 = (e: ChangeEvent<HTMLInputElement>) =>
    setF2({ ...f2, [e.target.name]: e.target.value });

  /* navegação */
  const goNext = (e: FormEvent) => { e.preventDefault(); setStep(2); };
  const goBack = () => setStep(1);

  /* envio final */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (f2.senha !== f2.confirmarSenha) {
      alert('As senhas não conferem!'); return;
    }
    setLoading(true);

    try {
      const { data } = await axios.post(API_URL, {
        ...f1,
        email: f2.email,
        senha: f2.senha,
        telefone: f2.telefone,
        tipo_telefone: 'm'
      });

      alert(data.mensagem);                  // TODO: toast/mensagem bonita
      window.location.href = '/empresa/login';

      /* limpa formulário caso volte aqui */
      setStep(1);
      setF1({ nome_fantasia:'', cnpj:'', categoria_id:'', descricao:'', endereco:'' });
      setF2({ email:'', senha:'', confirmarSenha:'', telefone:'' });

    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? (err as AxiosError<{mensagem?:string}>).response?.data?.mensagem
          ?? 'Erro inesperado.'
        : 'Erro inesperado.';
      alert(msg);
    } finally { setLoading(false); }
  };

  /* ────────────────────────── UI ────────────────────────── */
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow p-4">

            {/* cabeçalho + indicador */}
            <header className="text-center mb-4">
              <div className="d-flex justify-content-center gap-2 mb-2">
                <FaInfoCircle size={25} className="text-dark"/>
                <span className="logo-infojobs fs-4 fw-bold text-dark">InfoJobs</span>
              </div>
              <h4 className="fw-bold mb-0">Cadastre sua empresa</h4>
              <small className="text-muted">
                Já tem conta?&nbsp;
                <a href="/empresa/login" className="fw-semibold">Faça login</a>
              </small>

              <div className="d-flex justify-content-center step-indicator mt-3">
                <div className={`step ${step===1?'active':''}`}>1</div>
                <div className="line"/>
                <div className={`step ${step===2?'active':''}`}>2</div>
              </div>
            </header>

            {/* ─── ETAPA 1 ─── */}
            {step === 1 && (
              <Form onSubmit={goNext}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome da Empresa *</Form.Label>
                  <Form.Control type="text" name="nome_fantasia" required
                                value={f1.nome_fantasia} onChange={onF1}/>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>CNPJ *</Form.Label>
                  <Form.Control type="text" name="cnpj" required
                                value={f1.cnpj} onChange={onF1}
                                placeholder="00.000.000/0000-00"/>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Setor de Atuação *</Form.Label>
                  {/* TODO: substituir por lista dinâmica via API */}
                  <Form.Select name="categoria_id" required
                               value={f1.categoria_id} onChange={onF1}>
                    <option value="">Selecione</option>
                    <option value="1">Comércio</option>
                    <option value="2">Serviços</option>
                    <option value="3">Indústria</option>
                    <option value="4">Outros</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Endereço</Form.Label>
                  <Form.Control type="text" name="endereco"
                                value={f1.endereco} onChange={onF1}
                                placeholder="Rua, nº, cidade, UF"/>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Descrição da Empresa</Form.Label>
                  <Form.Control as="textarea" rows={3} name="descricao"
                                value={f1.descricao} onChange={onF1}/>
                </Form.Group>

                <Button type="submit" className="w-100" variant="primary">
                  Continuar
                </Button>
              </Form>
            )}

            {/* ─── ETAPA 2 ─── */}
            {step === 2 && (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Corporativo *</Form.Label>
                  <Form.Control type="email" name="email" required
                                value={f2.email} onChange={onF2}/>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Senha *</Form.Label>
                  <Form.Control type="password" name="senha" required
                                value={f2.senha} onChange={onF2}/>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirmar Senha *</Form.Label>
                  <Form.Control type="password" name="confirmarSenha" required
                                value={f2.confirmarSenha} onChange={onF2}/>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control type="text" name="telefone"
                                value={f2.telefone} onChange={onF2}
                                placeholder="(00) 0000-0000"/>
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button variant="outline-secondary" className="w-50" onClick={goBack}>
                    Voltar
                  </Button>
                  <Button type="submit" variant="primary" className="w-50" disabled={loading}>
                    {loading
                      ? <><Spinner size="sm"/> Cadastrando…</>
                      : 'Cadastrar Empresa'}
                  </Button>
                </div>
              </Form>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
