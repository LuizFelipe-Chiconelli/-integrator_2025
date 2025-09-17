'use client'

import { Button } from "react-bootstrap"
import { useSessionContext } from "../../session/context"

import type { CompanyInfo } from "@/types/company"

import FormProvider from "@/components/form-kit/context"
import EmailField from "@/components/form-kit/fields/email-field"

interface Props {
    info: CompanyInfo
}

export default function ChangeEmailForm({ info }: Props) {

    const { updateCompanyInfo } = useSessionContext()

    const onSubmit = (formData: Record<string, any>) => {
        updateCompanyInfo(formData as CompanyInfo)
    }

    return (
        <FormProvider onSubmit={onSubmit} className="mt-4">
            <EmailField
                id="email-input"
                name="email"
                label="Email"
                placeholder="Ex: exemplo@email.com"
                initialValue={info.email}
                required
            />

            <div className="d-flex justify-content-end mt-4">
                <Button type="submit">Salvar Alterações</Button>
            </div>
        </FormProvider>
    )
}