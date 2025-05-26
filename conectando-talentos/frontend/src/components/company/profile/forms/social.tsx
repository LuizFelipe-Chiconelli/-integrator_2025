import { Button, Form } from "react-bootstrap"
import TextInput from "../../../all/textinput"

export default function SocialForm() {
    return (
        <Form className="mt-4">
            <TextInput
                controlId="socialLinkedIn"
                label="LinkedIn"
                placeholder="Ex: https://linkedin.com/company/suaempresa"
            />

            <TextInput
                controlId="socialInstagram"
                label="Instragram"
                placeholder="Ex: @suaempresa"
            />

            <TextInput
                controlId="socialFacebook"
                label="Facebook"
                placeholder="Ex: SuaEmpresa"
            />

            <div className="d-flex justify-content-end mt-4">
                <Button>Atualizar Senha</Button>
            </div>
        </Form>
    )
}