// import type { CSSProperties } from "react"
import { Button, Container } from "react-bootstrap"

// const bannerStyle: CSSProperties = {
//     background: "url(/banner.webp) rgba(0,0,0,0.4)",
//     backgroundRepeat: "no-repeat",
//     backgroundPosition: "80% 60%",
//     backgroundBlendMode: "multiply"
// }

export default function Banner() {
    return (
        <Container
            fluid
            className="d-flex justify-content-center"
            style={{ padding: "100px 80px" }}
            // style={bannerStyle}
        >
            <div className="row flex-lg-row flex-column-reverse gap-lg-0 gap-3">
                <div
                    className="col-lg-6 d-flex flex-column justify-content-center align-items-center gap-5"
                >
                    <div className="text-center">
                        <h1 className="fw-bold">Bem-vindo ao InfoJobs</h1>
                        <span className="fs-3">Conquiste sua primeira vaga de emprego com facilidade!</span>
                    </div>
                    <Button>Acesse sua conta</Button>
                </div>

                <div className="col-lg-6 d-flex justify-content-center">
                    <img
                        src="/work.svg"
                        alt="Pessoas trabalhando"
                        className="w-75"
                    />
                </div>
            </div>
        </Container>
    )
}
