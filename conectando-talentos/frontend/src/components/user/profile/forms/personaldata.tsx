import { useEffect, useRef, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";

import TextInput from "@/components/all/textinput";
import Select from "@/components/all/select";
import DateInput from "@/components/all/dateinput";
import TextArea from "@/components/all/textarea";
import api from "@/services/api";

import { maskCPF, maskCEP, maskPhone } from "@/utils/masks";
import type { Option, InputHandler } from "@/types/inputs";

/* ---------------------- Tipos auxiliares ---------------------- */
interface CidadeAPI {
  id: number;
  nome: string;
  uf: string;
}

const optionSelecione: Option = { id: "null", displayName: "Selecione" };

export default function PersonalDataForm() {
  /* -------------------- Estado -------------------- */
  const [ufOptions, setUfOptions] = useState<Option[]>([optionSelecione]);
  const [cidadeOptions, setCidadeOptions] = useState<Option[]>([optionSelecione]);

  // controlados
  const [uf, setUf] = useState("null");
  const [cidade, setCidade] = useState("null");
  const [sexo, setSexo] = useState("null");

  const [perfilIncompleto, setPerfilIncompleto] = useState(false);

  /* -------------------- Refs -------------------- */
  const nomeRef = useRef<InputHandler>(null);
  const cpfRef = useRef<InputHandler>(null);
  const emailRef = useRef<InputHandler>(null);
  const logradouroRef = useRef<InputHandler>(null);
  const numeroRef = useRef<InputHandler>(null);
  const complementoRef = useRef<InputHandler>(null);
  const bairroRef = useRef<InputHandler>(null);
  const cepRef = useRef<InputHandler>(null);
  const telefoneRef = useRef<InputHandler>(null);
  const dataRef = useRef<InputHandler>(null);
  const apresentacaoRef = useRef<InputHandler>(null);

  /* -------------------- Carregamento inicial -------------------- */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<{ status: number; cidades: CidadeAPI[] }>("/cidade/lista");

        const ufs = Array.from(new Set(data.cidades.map((c) => c.uf))).sort();

        setUfOptions([optionSelecione, ...ufs.map((uf) => ({ id: uf, displayName: uf }))]);
        setCidadeOptions([
          optionSelecione,
          ...data.cidades.map((c) => ({ id: c.id.toString(), displayName: c.nome })),
        ]);

        await carregarPerfil();
      } catch {
        alert("Erro ao carregar dados iniciais.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------------------- Recarregar cidades ao mudar UF -------------------- */
  async function handleUfChange(novaUf: string) {
    setUf(novaUf);
    setCidade("null");

    if (novaUf === "null") {
      setCidadeOptions([optionSelecione]);
      return;
    }

    try {
      const { data } = await api.get<{ status: number; cidades: CidadeAPI[] }>(
        `/cidade/lista/${novaUf}`
      );

      setCidadeOptions([
        optionSelecione,
        ...data.cidades.map((c) => ({ id: c.id.toString(), displayName: c.nome })),
      ]);
    } catch {
      alert("Erro ao recarregar cidades.");
    }
  }

  /* -------------------- Carrega perfil -------------------- */
  async function carregarPerfil() {
    try {
      const { data } = await api.get("/usuario/perfil");

      if (data.pessoa_fisica) {
        nomeRef.current?.setValue(data.pessoa_fisica.nome ?? "");
        cpfRef.current?.setValue(data.pessoa_fisica.cpf ?? "");
      }
      emailRef.current?.setValue(data.usuario?.login ?? "");

      const cur = data.curriculum;
      if (!cur || Array.isArray(cur)) {
        setPerfilIncompleto(true);
        return;
      }

      logradouroRef.current?.setValue(cur.logradouro ?? "");
      numeroRef.current?.setValue(cur.numero ?? "");
      complementoRef.current?.setValue(cur.complemento ?? "");
      bairroRef.current?.setValue(cur.bairro ?? "");
      cepRef.current?.setValue(cur.cep ?? "");

      if (cur.uf) {
        setUf(cur.uf);
        await handleUfChange(cur.uf);
        setCidade(cur.cidade_id?.toString() ?? "null");
      }

      telefoneRef.current?.setValue(cur.celular ?? "");
      dataRef.current?.setValue(cur.dataNascimento ?? "");
      setSexo(cur.sexo || "null");
      apresentacaoRef.current?.setValue(cur.apresentacaoPessoal ?? "");
    } catch {
      alert("Erro ao carregar perfil.");
    }
  }

  /* -------------------- Submit -------------------- */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      nome: nomeRef.current?.getValue() ?? "",
      cpf: cpfRef.current?.getValue() ?? "",
      logradouro: logradouroRef.current?.getValue() ?? "",
      bairro: bairroRef.current?.getValue() ?? "",
      cep: (cepRef.current?.getValue() || "").replace(/\D/g, ""),
      cidade_id: Number(cidade || 0),
      telefone: (telefoneRef.current?.getValue() || "").replace(/\D/g, ""),
      data_nascimento: dataRef.current?.getValue() ?? "",
      sexo,
      email: emailRef.current?.getValue() ?? "",
      numero: numeroRef.current?.getValue() ?? "",
      complemento: complementoRef.current?.getValue() ?? "",
      uf,
      apresentacao: apresentacaoRef.current?.getValue() ?? "",
    };

    try {
      await api.post("/usuario/perfil", payload);
      alert("Dados salvos com sucesso!");
      setPerfilIncompleto(false);
    } catch (err) {
      alert("Erro ao salvar dados.");
      console.error(err);
    }
  }

  /* -------------------- JSX -------------------- */
  return (
    <Form className="mt-3" onSubmit={handleSubmit}>
      {perfilIncompleto && (
        <Alert variant="warning">
          Seu perfil ainda não está completo. Preencha os campos abaixo e clique em{" "}
          <strong>Salvar Alterações</strong>.
        </Alert>
      )}

      <TextInput ref={nomeRef} controlId="nome" label="Nome completo *" placeholder="Seu nome" required />

      <div className="row row-cols-1 row-cols-lg-2">
        <TextInput
          ref={cpfRef}
          controlId="cpf"
          label="CPF *"
          placeholder="000.000.000-00"
          required
          maxLength={11}
          onChange={(v: string) => cpfRef.current?.setValue(maskCPF(v))}
        />

        <TextInput ref={emailRef} controlId="email" label="Email *" placeholder="email@exemplo.com" readOnly />
      </div>

      <div className="row row-cols-1 row-cols-lg-2">
        <TextInput ref={logradouroRef} controlId="logradouro" label="Logradouro *" placeholder="Rua A" required />
        <TextInput ref={numeroRef} controlId="numero" label="Número" placeholder="123" />
      </div>

      <div className="row row-cols-1 row-cols-lg-2">
        <TextInput ref={complementoRef} controlId="complemento" label="Complemento" placeholder="Ap 1" />
        <TextInput ref={bairroRef} controlId="bairro" label="Bairro *" placeholder="Centro" required />
      </div>

      <div className="row row-cols-1 row-cols-lg-2">
        <TextInput
          ref={cepRef}
          controlId="cep"
          label="CEP *"
          placeholder="36880-000"
          required
          maxLength={9}
          onChange={(v: string) => cepRef.current?.setValue(maskCEP(v))}
        />

        <Select controlId="cidade_id" label="Cidade *" options={cidadeOptions} value={cidade} onChange={setCidade} required />
      </div>

      <div className="row row-cols-1 row-cols-lg-2">
        <Select controlId="uf" label="UF *" options={ufOptions} value={uf} onChange={handleUfChange} required />

        <TextInput
          ref={telefoneRef}
          controlId="telefone"
          label="Celular *"
          placeholder="(32) 99999-9999"
          required
          maxLength={11}
          onChange={(v: string) => telefoneRef.current?.setValue(maskPhone(v))}
        />
      </div>

      <div className="row row-cols-1 row-cols-lg-2">
        <DateInput ref={dataRef} controlId="data_nascimento" label="Data de Nascimento *" placeholder="aaaa-mm-dd" required />

        <Select
          controlId="sexo"
          label="Sexo *"
          options={[
            optionSelecione,
            { id: "M", displayName: "Masculino" },
            { id: "F", displayName: "Feminino" },
          ]}
          value={sexo}
          onChange={setSexo}
          required
        />
      </div>

      <div className="row row-cols-1 row-cols-lg-4">
        <TextArea ref={apresentacaoRef} controlId="apresentacao" label="Apresentação pessoal" placeholder="Fale sobre você…" />
      </div>

      <div className="d-flex justify-content-end mt-4">
        <Button type="submit">Salvar Alterações</Button>
      </div>
    </Form>
  );
}
