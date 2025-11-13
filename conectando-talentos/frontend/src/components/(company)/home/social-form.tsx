import { Button } from "react-bootstrap"
import { useCompanySessionContext } from "@/_session/company/context"

import type { Company } from "@/_session/company/types"

import { useState } from "react"
import FormProvider from "@/components/form-kit/context"
import TextField from "@/components/form-kit/fields/text-field"
import { useNotificationContext } from "@/components/notifications/context"

interface Props {
    info: Company
}

export default function SocialForm({ info }: Props) {
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
            <TextField
                id="linkedin-empresa"
                name="linkedin"
                label="LinkedIn"
                placeholder="Ex: https://linkedin.com/company/suaempresa"
                initialValue={info.linkedin}
            />

            <TextField
                id="instagram-empresa"
                name="instagram"
                label="Instagram"
                placeholder="Ex: @suaempresa"
                initialValue={info.instagram}
            />

            <TextField
                id="facebook-empresa"
                name="facebook"
                label="Facebook"
                placeholder="Ex: SuaEmpresa"
                initialValue={info.facebook}
            />

            <div className="d-flex justify-content-end mt-4">
                <Button type="submit">Salvar Alterações</Button>
            </div>
        </FormProvider>
    )
}