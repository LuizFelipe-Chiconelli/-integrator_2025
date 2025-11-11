'use client'

import { Button } from "react-bootstrap"
import { useCompanySessionContext } from "@/_session/company/context"

import type { Company } from "@/_session/company/types"

import FormProvider from "@/components/form-kit/context"
import EmailField from "@/components/form-kit/fields/email-field"
import { useState } from "react"
import { useNotificationContext } from "@/components/notifications/context"

interface Props {
    info: Company
}

export default function ChangeEmailForm({ info }: Props) {
    const [isPending, setIsPending] = useState<boolean>(false)

    const { sendNotification } = useNotificationContext()
    const { updateCompanyInfo } = useCompanySessionContext()

    const onSubmit = async (formData: Record<string, any>): Promise<void> => {
        if (isPending) return
        setIsPending(true)

        const res = await updateCompanyInfo(formData as Company)
        if (res.ok) {
            sendNotification({ message: res.message!, type: 'Success' })
            return setIsPending(false)
        }

        sendNotification({ message: res.message!, type: 'Error' })
        return setIsPending(false)
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