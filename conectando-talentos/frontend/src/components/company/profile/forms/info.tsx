import { Button, Form } from "react-bootstrap"

import TextArea from "../../../all/textarea"
import TextInput from "../../../all/textinput"

export default function InfoForm() {
    return (
        <Form className="mt-4">
            <TextInput
                controlId="infoNome"
                label="Nome da Empresa"
                placeholder="Digite o nome da empresa"
            />

            <TextInput
                controlId="infoCnpj"
                label="CNPJ"
                placeholder="Ex: 12.345.678/0001-90"
            />

            <TextInput
                controlId="infoSetor"
                label="Setor de Atuação"
                placeholder="Ex: Tecnologia"
            />

            <TextArea
                controlId="infoDesc"
                label="Descrição da Empresa"
                placeholder="Insira uma descrição para sua empresa..."
            />

            <div className="row">
                <div className="col-md-6">
                    <TextInput
                        controlId="infoWebsite"
                        label="Website"
                        placeholder="Ex: https://www.minhaempresa.com.br/"
                    />
                </div>

                <div className="col-md-6">
                    <TextInput
                        controlId="infoTelefone"
                        label="Telefone"
                        placeholder="Ex: (32) 91234-5678"
                    />
                </div>
            </div>

            <TextInput
                controlId="infoEndereço"
                label="Endereço"
                placeholder="Ex: Praça Irmã Annina Bisegna, 40 - Centro, Muriaé - MG"
            />

            <div className="d-flex justify-content-end mt-4">
                <Button>Salvar Alterações</Button>
            </div>
        </Form>
    )
}