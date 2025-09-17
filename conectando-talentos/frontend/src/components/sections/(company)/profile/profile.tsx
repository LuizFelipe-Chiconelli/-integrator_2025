'use client'

import { Container } from "react-bootstrap"

import { useSearchParams } from "react-router-dom"
import { useSessionContext } from "@/components/company/session/context"

import ProfileTabs from "@/components/company/profile/tabs"
import InfoForm from "@/components/company/profile/forms/info"
import SocialForm from "@/components/company/profile/forms/social"
import ChangeEmailForm from "@/components/company/profile/forms/change-email"
import ChangePasswordForm from "@/components/company/profile/forms/change-pass"

export default function ProfileForms() {
    const [searchParams, _] = useSearchParams()
    const tab: string | null = searchParams.get("tab")

    const { companyInfo } = useSessionContext()

    return (
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
    )
}