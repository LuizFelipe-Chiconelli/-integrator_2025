import { Button, Container } from "react-bootstrap"

import "./banner.css"

export default function Banner() {
    return (
        <Container id="banner" className="d-flex flex-column justify-content-center align-items-center gap-5">
            <div className="text-center">
                <h1>Bem-vindo ao InfoJobs</h1>
                <span className="fs-3">Conquiste sua primeira vaga de emprego com facilidade!</span>
            </div>

            <Button>Acesse sua conta</Button>
        </Container>
    )
}
