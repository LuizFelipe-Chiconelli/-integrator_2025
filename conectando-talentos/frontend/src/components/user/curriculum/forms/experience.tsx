import { Button, Form } from "react-bootstrap"

import { BsTrash } from "react-icons/bs"

import Check from "../../../all/check"
import Select from "../../../all/select"
import TextInput from "../../../all/textinput"

export default function ExperienceForm() {
    return (
        <Form className="border rounded-2 mt-3 p-4">
            <h3 className="fs-5 fw-bold">Experiência 1</h3>

            <div className="row row-cols-lg-2">
                <TextInput
                    controlId="exp1Cargo"
                    label="Cargo *"
                    placeholder="Desenvolvedor React"
                />

                <TextInput
                    controlId="exp1Empresa"
                    label="Empresa/Estabelecimento *"
                    placeholder="Tech Academy"
                />
            </div>

            <div className="row row-cols-lg-2">
                <div className="col-lg-3">
                    <Select
                        controlId="exp1InícioMes"
                        label="Mês de Início *"
                        placeholder="Fevereiro"
                    />
                </div>

                <div className="col-lg-3">
                    <TextInput
                        controlId="exp1InícioAno"
                        label="Ano de Início *"
                        placeholder={new Date().getFullYear().toString()}
                    />
                </div>

                <div className="col-lg-3">
                    <Select
                        controlId="exp1FimMes"
                        label="Mês de conclusão *"
                        placeholder="Fevereiro"
                    />
                </div>

                <div className="col-lg-3">
                    <TextInput
                        controlId="exp1FimAno"
                        label="Ano de conclusão *"
                        placeholder={new Date().getFullYear().toString()}
                    />
                </div>
            </div>

            <Check
                controlId="exp1Atual"
                label="Emprego atual"
            />

            <div className="d-flex justify-content-end">
                <Button className="d-flex gap-1 align-items-center" variant="danger">
                    <BsTrash /> Excluir
                </Button>
            </div>
        </Form>
    )
}