'use client'

import { Container } from "react-bootstrap"

import { useSearchParams } from "react-router-dom"
import { useCompanySessionContext } from "@/_session/company/context"

import ProfileTabs from "./tabs"
import InfoForm from "./info-form"
import SocialForm from "./social-form"
import ChangeEmailForm from "./change-email-form"
import ChangePasswordForm from "./change-pass-form"

export default function ProfileSection() {
    const [searchParams, _] = useSearchParams()
    const tab: string | null = searchParams.get("tab")

    const { companyInfo } = useCompanySessionContext()

    return (
        <Container className="bg-white border rounded-3 p-4 shadow-sm">
            <h1 className="fs-3 fw-bold m-0">Perfil da Empresa</h1>
            <span>Gerencie Informações da sua empresa</span>

            <Container fluid className="mt-4">
                <ProfileTabs />

                {companyInfo && (
                    <>
                        {(!tab || tab === "info") && (<InfoForm info={companyInfo} />)}

                        {(tab && tab === "account") && (
                            <div className="w-100 row row-cols-lg-2">
                                <ChangeEmailForm info={companyInfo} /> <ChangePasswordForm />
                            </div>
                        )}

                        {(tab && tab === "social") && (<SocialForm info={companyInfo} />)}
                    </>
                )}
            </Container>
        </Container>
    )
}