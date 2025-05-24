import { Button, Form } from "react-bootstrap"

import Select from "../../all/select"
import TextArea from "../../all/textarea"
import TextInput from "../../all/textinput"
import Check from "../../all/check"

export default function VacancyForm() {
    return (
        <Form className="mt-3">
            <TextInput
                controlId="vagaNome"
                label="Nome da vaga *"
                placeholder="Ex: Desenvolvedor Full Stack"
                required
            />

            <TextArea
                controlId="vagaDesc"
                label="Descrição da Vaga *"
                placeholder="Ex: Desenvolvedor Full Stack"
                required
            />

            <TextArea
                controlId="vagaNome"
                label="Nome da vaga *"
                placeholder="Ex: Desenvolvedor Full Stack"
                required
            />

            <div className="w-100 row row-cols-2 mx-auto">
                <div className="ps-0 pe-2">
                    <Select
                        controlId="vagaTipo"
                        label="Tipo de Contratação *"
                        placeholder="Selecione"
                        required
                    />
                </div>

                <div className="ps-2 pe-0">
                    <TextInput
                        controlId="vagaLocal"
                        label="Localização"
                        placeholder="Ex: São Paulo, SP"
                    />
                </div>
            </div>

            <div className="w-100 row row-cols-2 mx-auto">
                <div className="ps-0 pe-2">
                    <TextInput
                        controlId="vagaSalario"
                        label="Faixa Salarial"
                        placeholder="Ex: R$ 3.000 - R$ 5.000"
                    />
                </div>

                <div className="ps-2 pe-0">
                    <Select
                        controlId="vagaExp"
                        label="Nivel de experiência"
                        placeholder="Selecione"
                        required
                    />
                </div>
            </div>

            <div className="">
                <Check
                    controlId="vagaExp"
                    label="Esta é uma vaga remota"
                />
            </div>

            <div className="d-flex justify-content-end mb-4">
                <Button>Publicar Vaga</Button>
            </div>
        </Form>
    )
}