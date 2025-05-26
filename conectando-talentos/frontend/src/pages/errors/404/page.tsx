import { Container } from "react-bootstrap"

export default function PageNotFound() {
    return (
        <main>
            <Container className="d-flex flex-column align-items-center py-5">
                <img
                    src="/undraw-404.svg"
                    alt="Imagem de erro 404"
                    className="w-50"
                />
                <h1 className="fw-bold text-dark-emphasis mt-3">Página não encontrada</h1>
            </Container>
        </main>
    )
}