import { Button } from "react-bootstrap"
import { useSessionContext } from "../../session/context"

import type { CompanyInfo } from "@/types/company"

import FormProvider from "@/components/form-kit/context"
import TextField from "@/components/form-kit/fields/text-field"

interface Props {
    info: CompanyInfo
}

export default function SocialForm({ info }: Props) {

    const { updateCompanyInfo } = useSessionContext()

    const onSubmit = (formData: Record<string, any>) => {
        updateCompanyInfo(formData as CompanyInfo)
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