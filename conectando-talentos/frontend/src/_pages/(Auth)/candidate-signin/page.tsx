import { Container } from "react-bootstrap"

import CandidateSignInForm from "@/components/(auth)/candidate-signin/form"

export default function CandidateSignInPage() {
    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <CandidateSignInForm />
        </Container>
    )
}