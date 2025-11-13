import { Container } from "react-bootstrap"

import CompanySignUpForm from "@/components/(auth)/company-signup/form"

export default function CompanySignUpPage() {
    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100 p-4">
            <CompanySignUpForm />
        </Container>
    )
}