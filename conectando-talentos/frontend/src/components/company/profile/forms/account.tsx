import { Button, Form } from "react-bootstrap"

import TextInput from "../../../all/textinput"
import PasswordInput from "../../../all/passwordinput"

export default function AccountForm() {
    return (
        <Form className="mt-4">
            <TextInput
                controlId="accountEmail"
                label="Email"
                placeholder="Ex: exemplo@email.com"
            />

            <div className="w-100 border-bottom" />

            <h2 className="fw-semibold fs-6 mt-3">Alterar Senha</h2>

            <div className="mt-3">
                <PasswordInput
                    controlId="accountSenhaAtual"
                    label="Senha Atual"
                    placeholder="Digite sua senha atual"
                />

                <PasswordInput
                    controlId="accountNovaSenha"
                    label="Nova Senha"
                    placeholder="Digite sua nova senha"
                />

                <PasswordInput
                    controlId="accountConfirmarSenha"
                    label="Confirmar Nova Senha"
                    placeholder="Confirme sua nova senha"
                />
            </div>

            <div className="d-flex justify-content-end mt-4">
                <Button>Atualizar Senha</Button>
            </div>
        </Form>
    )
}