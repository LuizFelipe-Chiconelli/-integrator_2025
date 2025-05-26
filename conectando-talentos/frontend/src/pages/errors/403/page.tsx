import { Container } from "react-bootstrap"

export default function Unauthorized() {
    return (
        <main>
            <Container className="d-flex flex-column align-items-center py-5">
                <img
                    src="/undraw-403.svg"
                    alt="Imagem de erro 403"
                    className="w-50"
                />
                <h1 className="fw-bold text-dark-emphasis mt-3">Não Autorizado</h1>
            </Container>
        </main>
    )
}