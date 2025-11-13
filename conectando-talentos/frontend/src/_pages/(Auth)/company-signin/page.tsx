import { Container } from "react-bootstrap"

import CompanySignInForm from "@/components/(auth)/company-signin/form"

export default function CompanySignInPage() {
    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100 p-4">
            <CompanySignInForm />
        </Container>
    )
}