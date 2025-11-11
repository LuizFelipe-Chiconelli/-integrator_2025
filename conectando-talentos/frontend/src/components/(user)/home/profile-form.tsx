'use client'

import type { City, NewCity, UF } from "@/types/all"
import type { UserInfoPayload, User } from "@/_session/user/types"
import type { FieldMethods, Option } from "@/components/form-kit/types"

import { Button } from "react-bootstrap"
import { useEffect, useRef, useState } from "react"
import { useNotificationContext } from "@/components/notifications/context"

import api from "@/actions/api"

import FormProvider from "@/components/form-kit/context"
import CEPField from "@/components/form-kit/fields/cep-field"
import TextArea from "@/components/form-kit/fields/text-area"
import CPFField from "@/components/form-kit/fields/cpf-field"
import TextField from "@/components/form-kit/fields/text-field"
import DateField from "@/components/form-kit/fields/date-field"
import PhoneField from "@/components/form-kit/fields/phone-field"
import SelectField from "@/components/form-kit/fields/select-field"
import NumberField from "@/components/form-kit/fields/number-field"
import { fetchCitiesByUF, fetchUF } from "@/actions/all"

interface Props {
    info: User
    updateInfo: (info: UserInfoPayload) => Promise<{ ok: boolean, message?: string }>
}

export default function ProfileForm({ info, updateInfo }: Props) {
    const [uf, setUF] = useState<UF[]>([])
    const [cities, setCities] = useState<NewCity[] | null>(null)
    const [selectedUf, setSelectedUf] = useState<string>(info.curriculum.uf)

    const { sendNotification } = useNotificationContext()

    const ufRef = useRef<FieldMethods>(null)
    const cityRef = useRef<FieldMethods>(null)

    const genderOptions: Option[] = [
        { id: "", label: "Selecione" },
        { id: "M", label: "Masculino" },
        { id: "F", label: "Feminino" }
    ]

    const ufOptions: Option[] = uf ? [
        { id: "", label: "Selecione um estado" },
        ...uf.map((u) => { return { id: u.sigla, label: u.sigla }})
    ] : []

    const cityOptions: Option[] = cities ? [
        { id: "", label: "Selecione" },
        ...cities.map((c) => { return { id: c.codigo_ibge, label: c.nome } })
    ] : []

    const handleFetchUF = async () => {
        const res = await fetchUF()
        setUF(res)
    }

    const handleFetchCities = async () => {
        const res = await fetchCitiesByUF(selectedUf)
        setCities(res)
    }

    const onSubmit = async (formData: Record<string, any>): Promise<void> => {
        const payload: UserInfoPayload = formData as UserInfoPayload
        const res: { ok: boolean, message?: string } = await updateInfo(payload)

        if (res.ok) {
            sendNotification({ message: "Perfil atualizado com sucesso!", type: "Success" })
            return
        }

        sendNotification({ message: "Erro ao atualizar perfil!", type: "Error" })
        return
    }

    const handleSelectUf = (val: string) => {
        setSelectedUf(val)
        ufRef.current?.setValue?.(val)
    }

    useEffect(() => { handleFetchUF() }, [])

    useEffect(() => {
        if (selectedUf) {
            handleFetchCities()
        }
    }, [uf])

    useEffect(() => {
        let exists: boolean = cityOptions.some(opt => opt.id === info.curriculum.cidade_id)

        if (selectedUf != "" && exists) {
            cityRef.current?.setValue?.(info.curriculum.cidade_id)
        }

        if (selectedUf != ufRef.current?.getValue()) {
            ufRef.current?.setValue?.(info.curriculum.uf)
        }
    }, [ufOptions, cityOptions, cities])

    return (
        <FormProvider className="d-flex flex-column mt-3" onSubmit={onSubmit}>
            <TextField
                id={`nome`}
                name="nome"
                label="Nome Completo *"
                placeholder="Digite seu nome completo"
                initialValue={info.pessoa_fisica.nome}
                required
            />

            <div className="row row-cols-lg-2">
                <CPFField
                    id={`cpf`}
                    name="cpf"
                    label="CPF *"
                    placeholder="Ex: 000.000.000-00"
                    initialValue={info.pessoa_fisica.cpf || ""}
                    required
                />

                <TextField
                    id={`email`}
                    name="email"
                    label="Endereço de email *"
                    placeholder="Ex: teste@email.com"
                    initialValue={info.curriculum.email || ""}
                    required
                />
            </div>

            <div className="row row-cols-lg-2">
                <TextField
                    id={`logradouro`}
                    name="logradouro"
                    label="Logradouro *"
                    placeholder="Ex: Rua das graças"
                    initialValue={info.curriculum.logradouro || ""}
                    required
                />

                <NumberField
                    id={`numero`}
                    name="numero"
                    label="Número"
                    placeholder="Ex: 25"
                    initialValue={info.curriculum.numero ? String(info.curriculum.numero) : ""}
                />
            </div>

            <div className="row row-cols-lg-2">
                <TextField
                    id={`complemento`}
                    name="complemento"
                    label="Complemento"
                    placeholder="Ex: Apartamento 404"
                    initialValue={info.curriculum.complemento}
                />

                <TextField
                    id={`bairro`}
                    name="bairro"
                    label="Bairro *"
                    placeholder="Ex: Centro"
                    initialValue={info.curriculum.bairro}
                    required
                />
            </div>

            <div className="row row-cols-lg-2">
                <CEPField
                    id={`cep`}
                    name="cep"
                    label="CEP *"
                    placeholder="Ex: 00000-000"
                    initialValue={info.curriculum.cep}
                    required
                />

                <SelectField
                    id={`cidade`}
                    ref={cityRef}
                    name="cidade_id"
                    label="Cidade *"
                    options={cityOptions}
                    initialValue={String(info.curriculum.cidade_id)}
                    required
                />
            </div>

            <div className="row row-cols-lg-2">
                <SelectField
                    id={`uf`}
                    ref={ufRef}
                    name="uf"
                    label="UF *"
                    options={ufOptions}
                    onChange={handleSelectUf}
                    initialValue={info.curriculum.uf}
                    required
                />

                <PhoneField
                    id={`celular`}
                    name="telefone"
                    label="Telefone *"
                    placeholder="Ex: (32) 99999-9999"
                    initialValue={info.curriculum.celular}
                    required
                />
            </div>

            <div className="row row-cols-lg-2">
                <DateField
                    id={`nasc-data`}
                    name="data_nascimento"
                    label="Data de Nascimento *"
                    placeholder="dd/mm/aaaa"
                    initialValue={info.curriculum.dataNascimento}
                    required
                />

                <SelectField
                    id={`sexo`}
                    name="sexo"
                    label="Sexo *"
                    options={genderOptions}
                    initialValue={info.curriculum.sexo}
                    required
                />
            </div>

            <TextArea
                id={`apresentacao`}
                name="apresentacao"
                label="Apresentação Pessoal *"
                placeholder="Fale um pouco sobre você"
                initialValue={info.curriculum.apresentacaoPessoal}
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