import { Button } from "react-bootstrap"
import { useCompanySessionContext } from "@/_session/company/context"

import type { Company } from "@/_session/company/types"

import FormProvider from "@/components/form-kit/context"
import TextField from "@/components/form-kit/fields/text-field"

interface Props {
    info: Company
}

export default function SocialForm({ info }: Props) {
    const { updateCompanyInfo } = useCompanySessionContext()

    const onSubmit = (formData: Record<string, any>) => {
        updateCompanyInfo(formData as Company)
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