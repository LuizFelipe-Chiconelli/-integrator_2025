import { Button, Form } from "react-bootstrap"

import { BsTrash } from "react-icons/bs"

import TextInput from "@/components/all/textinput"
import Select from "@/components/all/select"

export default function QualificationForm() {
    return (
        <Form className="border rounded-2 mt-3 p-4">
            <h3 className="fs-5 fw-bold">Curso 1</h3>

            <div className="row row-cols-lg-2">
                <TextInput
                    controlId="curso1Desc"
                    label="Nome/descrição do curso *"
                    placeholder="React Avançado"
                />

                <TextInput
                    controlId="curso1Instituicao"
                    label="Instituição *"
                    placeholder="Tech Academy"
                />
            </div>

            <div className="row row-cols-lg-2">
                <div className="col-lg-6">
                    <TextInput
                        controlId="curso1Carga"
                        label="Carga horária (h) *"
                        placeholder="40"
                    />
                </div>

                <div className="col-lg-3">
                    <Select
                        controlId="curso1FimMes"
                        label="Mês de conclusão *"
                        options={[ { id: "null", displayName: "Selecione" } ]}
                    />
                </div>

                <div className="col-lg-3">
                    <TextInput
                        controlId="curso1DFimAno"
                        label="Ano de conclusão *"
                        placeholder={new Date().getFullYear().toString()}
                    />
                </div>
            </div>

            <div className="d-flex justify-content-end">
                <Button className="d-flex gap-1 align-items-center" variant="danger">
                    <BsTrash /> Excluir
                </Button>
            </div>
        </Form>
    )
}