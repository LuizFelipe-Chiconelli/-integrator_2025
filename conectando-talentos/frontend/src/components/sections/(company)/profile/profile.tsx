import { Container } from "react-bootstrap"

import { useSearchParams } from "react-router-dom"

import ProfileTabs from "@/components/company/profile/tabs"
import InfoForm from "@/components/company/profile/forms/info"
import SocialForm from "@/components/company/profile/forms/social"
import AccountForm from "@/components/company/profile/forms/account"

export default function ProfileForms() {
    const [searchParams, _] = useSearchParams()
    const tab: string | null = searchParams.get("tab")

    return (
        <Container fluid className="mt-4">
            <ProfileTabs />

            {(!tab || tab === "info") && (<InfoForm />)}
            {(tab && tab === "account") && (<AccountForm />)}
            {(tab && tab === "social") && (<SocialForm />)}
        </Container>
    )
}