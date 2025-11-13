import { Container } from "react-bootstrap"

import CandidateSignUpForm from "@/components/(auth)/candidate-signup/form"

export default function CandidateSignUpPage() {
    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <CandidateSignUpForm />
        </Container>
    )
}