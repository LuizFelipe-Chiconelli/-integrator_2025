'use client'

import { Button } from "react-bootstrap"
import { useSessionContext } from "../../session/context"

import type { CompanyInfo } from "@/types/company"

import FormProvider from "@/components/form-kit/context"
import TextArea from "@/components/form-kit/fields/text-area"
import TextField from "@/components/form-kit/fields/text-field"


interface Props {
    info: CompanyInfo
}

export default function InfoForm({ info }: Props) {

    const { updateCompanyInfo } = useSessionContext()

    const onSubmit = (formData: Record<string, any>) => {
        updateCompanyInfo(formData as CompanyInfo)
    }

    return (
        <FormProvider onSubmit={onSubmit} className="mt-4">
            <TextField
                id="nome-empresa"
                name="nome"
                label="Nome da Empresa *"
                placeholder="Digite o nome da empresa"
                initialValue={info.nome}
                required
            />

            <TextField
                id="cnpj-empresa"
                name="cnpj"
                label="CNPJ *"
                placeholder="Ex: 12.345.678/0001-90"
                initialValue={info.cnpj}
                required
            />

            <TextField
                id="setor-empresa"
                name="setor"
                label="Setor de Atuação"
                placeholder="Ex: Tecnologia"
                initialValue={info.setor}
            />

            <TextArea
                id="descricao-empresa"
                name="descricao"
                label="Descrição da Empresa"
                placeholder="Insira uma descrição para sua empresa..."
                initialValue={info.descricao}
            />

            <div className="row">
                <div className="col-md-6">
                    <TextField
                        id="website-empresa"
                        name="website"
                        label="Website"
                        placeholder="Ex: https://www.minhaempresa.com.br/"
                        initialValue={info.website}
                    />
                </div>

                <div className="col-md-6">
                    <TextField
                        id="telefone-empresa"
                        name="telefone"
                        label="Telefone"
                        placeholder="Ex: (32) 91234-5678"
                    />
                </div>
            </div>

            <TextField
                id="endereco-empresa"
                name="endereco"
                label="Endereço *"
                placeholder="Ex: Praça Irmã Annina Bisegna, 40 - Centro, Muriaé - MG"
                initialValue={info.endereco}
                required
            />

            <div className="d-flex justify-content-end mt-4">
                <Button type="submit">Salvar Alterações</Button>
            </div>
        </FormProvider>
    )
}