'use client'

import { useState } from "react"
import { Button } from "react-bootstrap"
import { useCompanySessionContext } from "@/_session/company/context"
import { useNotificationContext } from "@/components/notifications/context"

import type { Company } from "@/_session/company/types"

import FormProvider from "@/components/form-kit/context"
import TextArea from "@/components/form-kit/fields/text-area"
import TextField from "@/components/form-kit/fields/text-field"
import CNPJField from "@/components/form-kit/fields/cnpj-field"
import PhoneField from "@/components/form-kit/fields/phone-field"


interface Props {
    info: Company
}

export default function InfoForm({ info }: Props) {
    const [isPending, setIsPending] = useState<boolean>(false)

    const { updateCompanyInfo } = useCompanySessionContext()
    const { sendNotification } = useNotificationContext()

    const onSubmit = async (formData: Record<string, any>) => {
        if (isPending) return
        setIsPending(true)

        const res = await updateCompanyInfo(formData as Company)
        if (res.ok) {
            sendNotification({ message: res.message!, type: 'Success' })
            return setIsPending(false)
        }

        sendNotification({ message: res.message!, type: 'Error' })
        return setIsPending(false)
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

            <CNPJField
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
                    <PhoneField
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