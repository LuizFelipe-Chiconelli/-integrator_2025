'use client'

import type { UserInfo } from "@/types/user"

import { Button } from "react-bootstrap"

import FormProvider from "@/components/form-kit/context"
import TextField from "@/components/form-kit/fields/text-field"
import TextArea from "@/components/form-kit/fields/text-area"

interface Props {
    info?: UserInfo | null
}

export default function ProfileForm({ info }: Props) {

    const onSubmit = (formData: Record<string, any>) => {
        console.log(formData)
    }

    return (
        <FormProvider className="d-flex flex-column mt-3" onSubmit={onSubmit}>
            <TextField
                id={`nome`}
                // ref={nameRef}
                name="nome"
                label="Nome Completo *"
                placeholder="Digite seu nome completo"
                initialValue={info?.pessoa_fisica.nome}
                required
            />

            <div className="row row-cols-lg-2">
                <TextField
                    id={`cpf`}
                    name="cpf"
                    label="CPF *"
                    placeholder="Ex: 000.000.000-00"
                    initialValue={info?.pessoa_fisica.cpf || ""}
                    required
                />

                <TextField
                    id={`email`}
                    name="email"
                    label="Endereço de email *"
                    placeholder="Ex: teste@email.com"
                    initialValue={info?.curriculum.email || ""}
                    required
                />
            </div>

            <div className="row row-cols-lg-2">
                <TextField
                    id={`logradouro`}
                    name="logradouro"
                    label="Logradouro *"
                    placeholder="Ex: Rua das graças"
                    initialValue={info?.curriculum.logradouro || ""}
                    required
                />

                <TextField
                    id={`numero`}
                    name="numero"
                    label="Número"
                    placeholder="Ex: teste@email.com"
                    initialValue={String(info?.curriculum.numero)}
                />
            </div>

            <div className="row row-cols-lg-2">
                <TextField
                    id={`complemento`}
                    name="complemento"
                    label="Complemento"
                    placeholder="Ex: Rua das graças"
                    initialValue={info?.curriculum.complemento}
                />

                <TextField
                    id={`bairro`}
                    name="bairro"
                    label="Bairro *"
                    placeholder="Ex: Centro"
                    initialValue={info?.curriculum.bairro}
                    required
                />
            </div>

            <div className="row row-cols-lg-2">
                <TextField
                    id={`cep`}
                    name="cep"
                    label="CEP *"
                    placeholder="Ex: 00000-000"
                    initialValue={info?.curriculum.cep}
                    required
                />

                <TextField
                    id={`cidade`}
                    name="cidade"
                    label="Bairro *"
                    placeholder="Ex: Centro"
                    initialValue={info?.curriculum.cidade}
                    required
                />
            </div>

            <div className="row row-cols-lg-2">
                <TextField
                    id={`uf`}
                    name="uf"
                    label="UF *"
                    placeholder="Ex: MG"
                    initialValue={info?.curriculum.uf}
                    required
                />

                <TextField
                    id={`celular`}
                    name="celular"
                    label="Telefone *"
                    placeholder="Ex: (32) 99999-9999"
                    initialValue={info?.curriculum.celular}
                    required
                />
            </div>

            <div className="row row-cols-lg-2">
                <TextField
                    id={`nasc-data`}
                    name="dataNascimento"
                    label="Data de Nascimento *"
                    placeholder="dd/mm/aaaa"
                    initialValue={info?.curriculum.dataNascimento}
                    required
                />

                <TextField
                    id={`sexo`}
                    name="sexo"
                    label="Sexo *"
                    placeholder="Selecione"
                    initialValue={info?.curriculum.sexo}
                    required
                />
            </div>

            <TextArea
                id={`apresentacao`}
                name="apresentacaoPessoal"
                label="Apresentação Pessoal *"
                placeholder="Fale um pouco sobre você"
                initialValue={info?.curriculum.apresentacaoPessoal}
                required
            />

            <div className="d-flex justify-content-end mt-3">
                <Button type="submit" variant="primary">
                    Salvar Alterações
                </Button>
            </div>
        </FormProvider>
    )
}