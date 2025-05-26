import { Button, Form } from "react-bootstrap"

import Select from "../../all/select"
import TextArea from "../../all/textarea"
import TextInput from "../../all/textinput"
import Check from "../../all/check"

export default function VacancyForm() {
    return (
        <Form className="mt-4">
            {/* Nome da vaga */}
            <TextInput
                controlId="vagaNome"
                label="Nome da vaga *"
                placeholder="Ex: Desenvolvedor Full Stack"
                required
            />

            {/* Descrição da vaga */}
            <TextArea
                controlId="vagaDesc"
                label="Descrição da Vaga *"
                placeholder="Descreva detalhadamente a vaga..."
                required
            />

            {/* Requisitos para a vaga */}
            <TextArea
                controlId="vagaRequisitos"
                label="Requisitos da vaga *"
                placeholder="Liste os requisitos necessários para a vaga..."
                required
            />

            <div className="w-100 row row-cols-2 mx-auto">
                {/* Tipo de vaga */}
                <div className="ps-0 pe-2">
                    <Select
                        controlId="vagaTipo"
                        label="Tipo de Contratação *"
                        placeholder="Selecione"
                        required
                    />
                </div>

                {/* Local da vaga */}
                <div className="ps-2 pe-0">
                    <TextInput
                        controlId="vagaLocal"
                        label="Localização"
                        placeholder="Ex: São Paulo, SP"
                    />
                </div>
            </div>

            <div className="w-100 row row-cols-2 mx-auto">
                {/* Salário */}
                <div className="ps-0 pe-2">
                    <TextInput
                        controlId="vagaSalario"
                        label="Faixa Salarial"
                        placeholder="Ex: R$ 3.000 - R$ 5.000"
                    />
                </div>

                {/* Experiência */}
                <div className="ps-2 pe-0">
                    <Select
                        controlId="vagaExp"
                        label="Nivel de experiência"
                        placeholder="Selecione"
                        required
                    />
                </div>
            </div>

            {/* Vaga remota */}
            <div className="">
                <Check
                    controlId="vagaExp"
                    label="Esta é uma vaga remota"
                />
            </div>

            <div className="d-flex justify-content-end mt-4">
                <Button>Publicar Vaga</Button>
            </div>
        </Form>
    )
}