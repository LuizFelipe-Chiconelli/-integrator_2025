'use client';

import { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa";
import { AxiosError } from "axios";

import api from "@/services/api";    // mesma instância global que já funciona no usuário
import { maskCNPJ } from "@/utils/masks"; // máscara para CNPJ

export default function EmpresaRegister() {
  /* ---------- estado do formulário ---------- */
  const [form, setForm] = useState({
    nome: "",
    cnpj: "",
    endereco: "",
    descricao: "",
    email: "",
    senha: "",
    confirmarSenha: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "cnpj") {
      setForm({ ...form, [name]: maskCNPJ(value) }); // aplica máscara
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.senha !== form.confirmarSenha) {
      alert("As senhas não conferem!");
      return;
    }

    try {
      const { data } = await api.post("/empresa/cadastrar", {
        nome: form.nome,
        cnpj: form.cnpj,
        endereco: form.endereco,
        descricao: form.descricao,
        email: form.email,
        senha: form.senha
      });

      alert(data.mensagem ?? "Empresa cadastrada com sucesso!");

      /* limpa o formulário */
      setForm({
        nome: "",
        cnpj: "",
        endereco: "",
        descricao: "",
        email: "",
        senha: "",
        confirmarSenha: ""
      });

    } catch (err: unknown) {
      let msg = "Erro inesperado ao cadastrar empresa.";
      if (err instanceof AxiosError) {
        msg = err.response?.data?.mensagem ?? msg;
      }
      alert(msg);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col md={7} lg={6}>
          <Card className="shadow p-4">
            {/* ---------- cabeçalho ---------- */}
            <div className="text-center mb-4">
              <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
                <FaInfoCircle size={25} className="text-dark" />
                <span className="logo-infojobs text-dark fs-3">InformJobs</span>
              </div>
              <h4 className="fw-bold">Cadastre sua empresa</h4>
              <p className="text-muted">
                Já tem uma conta?{" "}
                <a href="/empresa/login" className="text-primary">
                  Faça login
                </a>
              </p>
            </div>

            {/* ---------- formulário ---------- */}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formNome" className="mb-3">
                <Form.Label>Nome da Empresa *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ex: Padaria Central"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formCnpj" className="mb-3">
                <Form.Label>CNPJ *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="00.000.000/0000-00"
                  name="cnpj"
                  value={form.cnpj}
                  maxLength={18}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) e.preventDefault();
                  }}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formEndereco" className="mb-3">
                <Form.Label>Endereço</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Rua, nº, cidade, UF"
                  name="endereco"
                  value={form.endereco}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formDescricao" className="mb-3">
                <Form.Label>Descrição da Empresa</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Fale um pouco sobre sua empresa"
                  name="descricao"
                  value={form.descricao}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email Corporativo *</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="empresa@email.com"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group controlId="formSenha" className="mb-3">
                    <Form.Label>Senha *</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="********"
                      name="senha"
                      value={form.senha}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formConfirmarSenha" className="mb-3">
                    <Form.Label>Confirmar Senha *</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="********"
                      name="confirmarSenha"
                      value={form.confirmarSenha}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button
                type="submit"
                variant="primary"
                className="w-100"
              >
                Cadastrar Empresa
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
