import { Button, Form } from "react-bootstrap"

import { BsTrash } from "react-icons/bs"

import Select from "../../../all/select"
import TextInput from "../../../all/textinput"

export default function EducationForm() {
    return (
        <Form className="border rounded-2 mt-3 p-4">
            <div className="row">
                <h3 className="fs-5 fw-bold">Escolaridade 1</h3>
            </div>

            <div className="row row-cols-lg-2">
                <Select
                    controlId="education1Grau"
                    label="Grau escolar *"
                    placeholder="Superior"
                />

                <TextInput
                    controlId="education1Cargo"
                    label="Cargo / Descrição *"
                    placeholder="Análise e Desenvolvimento de Sistemas"
                />
            </div>

            <div className="row row-cols-lg-2">
                <TextInput
                    controlId="education1Instituicao"
                    label="Instituição *"
                    placeholder="Faculdade Santa Marcelina"
                />

                <TextInput
                    controlId="education1Cidade"
                    label="Cidade *"
                    placeholder="Muriaé"
                />
            </div>

            <div className="row row-cols-lg-4">
                <Select
                    controlId="education1InicioMes"
                    label="Mês de Início *"
                    placeholder="Fevereiro"
                />

                <TextInput
                    controlId="education1InicioAno"
                    label="Ano de Início *"
                    placeholder={new Date().getFullYear().toString()}
                />

                <Select
                    controlId="education1FimMes"
                    label="Mês de Fim *"
                    placeholder="Fevereiro"
                />

                <TextInput
                    controlId="education1FimAno"
                    label="Ano de Fim *"
                    placeholder={new Date().getFullYear().toString()}
                />
            </div>

            <div className="d-flex justify-content-end">
                <Button className="d-flex gap-1 align-items-center" variant="danger">
                    <BsTrash /> Excluir
                </Button>
            </div>
        </Form>
    )
}