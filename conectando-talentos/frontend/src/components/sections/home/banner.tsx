import type { CSSProperties } from "react"
import { Button, Container } from "react-bootstrap"

import "./banner.css"

const bannerStyle: CSSProperties = {
    background: "url(/banner.webp) rgba(0,0,0,0.4)",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "80% 60%",
    backgroundBlendMode: "multiply"
}

export default function Banner() {
    return (
        <Container
            fluid
            className="d-flex justify-content-center"
            style={bannerStyle}
        >
            <Container
                className="d-flex flex-column justify-content-center align-items-center gap-5"
                style={{ padding: "200px 80px" }}
            >
                <div className="text-center text-white">
                    <h1>Bem-vindo ao InfoJobs</h1>
                    <span className="fs-3">Conquiste sua primeira vaga de emprego com facilidade!</span>
                </div>
                <Button>Acesse sua conta</Button>
            </Container>
        </Container>
    )
}
