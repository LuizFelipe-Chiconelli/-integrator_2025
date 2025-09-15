'use client'

import type { City } from "@/types/all"
import type { UserInfo, UserInfoPayload } from "@/types/user"
import type { FieldMethods, Option } from "@/components/form-kit/types"

import { useEffect, useRef, useState } from "react"
import { Button } from "react-bootstrap"

import api from "@/services/api"

import FormProvider from "@/components/form-kit/context"
import TextArea from "@/components/form-kit/fields/text-area"
import TextField from "@/components/form-kit/fields/text-field"
import SelectField from "@/components/form-kit/fields/select-field"

interface Props {
    info: UserInfo
    updateInfo: (info: UserInfoPayload) => Promise<void>
}

export default function ProfileForm({ info, updateInfo }: Props) {
    const [cities, setCities] = useState<City[] | null>(null)
    const [selectedUf, setSelectedUf] = useState<string>(info.curriculum.uf)

    const ufRef = useRef<FieldMethods>(null)
    const cityRef = useRef<FieldMethods>(null)

    const genderOptions: Option[] = [
        { id: "", label: "Selecione" },
        { id: "M", label: "Masculino" },
        { id: "F", label: "Feminino" }
    ]

    const ufOptions: Option[] = cities ? [
        { id: "", label: "Selecione um estado" },
        ...Array.from(new Set(cities.map(c => c.uf))).map((uf) => {
            return { id: uf, label: uf }
        })
    ] : []

    const cityOptions: Option[] = cities ? [
        { id: "", label: "Selecione" },
        ...Array.from(
            cities.filter((c) => { return c.uf === selectedUf })
        ).map((c) => { return { id: c.id, label: c.nome } })
    ] : []

    const fetchLocations = async () => {
        const { status, data } = await api.get("/cidade/lista")
        if (status == 200) setCities(data.cidades)
    }

    const onSubmit = (formData: Record<string, any>) => {
        const payload: UserInfoPayload = formData as UserInfoPayload
        console.log(payload)

        updateInfo(payload)
    }

    const handleSelectUf = (val: string) => {
        setSelectedUf(val)
        ufRef.current?.setValue?.(val)
    }

    useEffect(() => { fetchLocations() }, [])

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
                <TextField
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

                <TextField
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
                <TextField
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

                <TextField
                    id={`celular`}
                    name="telefone"
                    label="Telefone *"
                    placeholder="Ex: (32) 99999-9999"
                    initialValue={info.curriculum.celular}
                    required
                />
            </div>

            <div className="row row-cols-lg-2">
                <TextField
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