'use client'

import { Button } from "react-bootstrap"
import { useCompanySessionContext } from "@/_session/company/context"

import type { Company } from "@/_session/company/types"

import FormProvider from "@/components/form-kit/context"
import EmailField from "@/components/form-kit/fields/email-field"

interface Props {
    info: Company
}

export default function ChangeEmailForm({ info }: Props) {

    const { updateCompanyInfo } = useCompanySessionContext()

    const onSubmit = (formData: Record<string, any>) => {
        updateCompanyInfo(formData as Company)
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