import { Container } from "react-bootstrap"

export default function Banner() {
    return (
        <Container
            fluid
            className="d-flex justify-content-center"
            style={{ padding: "100px 80px" }}
        >
            <div className="d-flex flex-column justify-content-center gap-3">
                <div className="d-flex justify-content-center">
                    <img
                        src="/work2.svg"
                        alt="Pessoas trabalhando"
                        className="w-50"
                    />
                </div>

                <div className="text-center">
                    <h2 className="fw-bold text-primary">Sobre a InformJobs</h2>
                    <p className="">
                        Conectando talentos locais com as melhores oportunidades da região
                    </p>
                </div>
            </div>
        </Container>
    )
}
