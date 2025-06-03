import { Button, Form } from "react-bootstrap"

import TextInput from "../../../all/textinput"
import Select from "../../../all/select"
import DateInput from "../../../all/dateinput"
import FileInput from "../../../all/fileinput"
import TextArea from "../../../all/textarea"

export default function PersonalDataForm() {
    return (
        <Form className="mt-3">
            <TextInput
                controlId="pessoalNome"
                label="Nome completo *"
                placeholder="Ex: John Doe"
            />

            <div className="row row-cols-1 row-cols-lg-2">
                <TextInput
                    controlId="pessoalCPF"
                    label="CPF *"
                    placeholder="Ex: 123.456.789-00"
                />

                <TextInput
                    controlId="pessoalEmail"
                    label="Email *"
                    placeholder="Ex: exemplo@email.com"
                />
            </div>

            <div className="row row-cols-1 row-cols-lg-2">
                <TextInput
                    controlId="pessoalLogradouro"
                    label="Logradouro *"
                    placeholder=""
                />

                <TextInput
                    controlId="pessoalNum"
                    label="Número *"
                    placeholder=""
                />
            </div>

            <div className="row row-cols-1 row-cols-lg-2">
                <TextInput
                    controlId="pessoalComplemento"
                    label="Complemento"
                    placeholder=""
                />

                <TextInput
                    controlId="pessoalBairro"
                    label="Bairro *"
                    placeholder=""
                />
            </div>

            <div className="row row-cols-1 row-cols-lg-2">
                <TextInput
                    controlId="pessoalCEP"
                    label="CEP *"
                    placeholder=""
                />

                <TextInput
                    controlId="pessoalCidade"
                    label="Cidade *"
                    placeholder=""
                />
            </div>

            <div className="row row-cols-1 row-cols-lg-2">
                <Select
                    controlId="pessoalUF"
                    label="UF *"
                    placeholder="Selecione o estado"
                />

                <TextInput
                    controlId="pessoalTelefone"
                    label="Telefone *"
                    placeholder="(00) 00000-0000"
                />
            </div>

            <div className="row row-cols-1 row-cols-lg-2">
                <DateInput
                    controlId="pessoalData"
                    label="Data de Nascimento *"
                    placeholder="dd/mm/aaaa"
                />

                <Select
                    controlId="pessoalSexo"
                    label="Sexo *"
                    placeholder="Selecione o sexo"
                />
            </div>

            <div className="row row-cols-1 row-cols-lg-4">
                <FileInput
                    controlId="pessoalFoto"
                    label="Foto (upload)"
                    text="Enviar Foto"
                />
            </div>

            <TextArea
                controlId="pessoalApresentacao"
                label="Apresentação pessoal"
                placeholder="Faça um pequeno texto se apresentando..."
            />

            <div className="d-flex justify-content-end mt-4">
                <Button>Salvar Alterações</Button>
            </div>
        </Form>
    )
}