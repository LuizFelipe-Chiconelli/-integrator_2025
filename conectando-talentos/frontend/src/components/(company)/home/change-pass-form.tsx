'use client'

import { useState } from "react"

import { Button, FormCheck } from "react-bootstrap"

import FormProvider from "@/components/form-kit/context"
import PasswordField from "@/components/form-kit/fields/password-field"

export default function ChangePasswordForm() {
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false)

    const checkHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.checked ? setPasswordVisible(true) : setPasswordVisible(false)
    }

    const onSubmit = (formData: Record<any, string>) => {}

    return (
        <FormProvider onSubmit={onSubmit} className="mt-4">
            <PasswordField
                id="current-password"
                name="senha_atual"
                label="Senha Atual"
                placeholder="Digite sua senha atual"
                visible={passwordVisible}
                required
            />

            <PasswordField
                id="new-pass"
                name="nova_senha"
                label="Nova Senha"
                placeholder="Digite sua nova senha"
                visible={passwordVisible}
                required
            />

            <PasswordField
                id="confirm-new-pass"
                name="confirmacao_nova_senha"
                label="Confirmar Nova Senha"
                placeholder="Confirme sua nova senha"
                visible={passwordVisible}
                required
            />

            <FormCheck onChange={checkHandle} label="Mostrar senhas" />

            <div className="d-flex justify-content-end mt-4">
                <Button type="submit">Salvar Alterações</Button>
            </div>
        </FormProvider>
    )
}