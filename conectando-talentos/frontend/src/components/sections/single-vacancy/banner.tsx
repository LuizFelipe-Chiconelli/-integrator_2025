// Tipos
import type { CSSProperties } from "react"

import { Container } from "react-bootstrap"

const bannerStyle: CSSProperties = {
    background: "url(/banner.webp) rgba(0,0,0,.4)",
    backgroundBlendMode: "multiply",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat"
}

export default function Banner() {
    return (
        <Container
            style={bannerStyle}
            fluid
        >
            <Container style={{ padding: "200px 80px" }}>
                <h1 className="text-white">Sobre a Vaga</h1>
            </Container>
        </Container>
    )
}