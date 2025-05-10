import { Container } from "react-bootstrap"

export default function Home() {
    return (
        <main>
            <Container className="d-flex flex-column align-items-center my-5">
                <h1>Bem-vindo ao InfoJobs</h1>
                <span>Conquiste sua primeira vaga de emprego com facilidade!</span>
            </Container>
        </main>
    )
}