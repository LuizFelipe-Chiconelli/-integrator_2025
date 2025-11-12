import { Container } from "react-bootstrap"

import { MdOutlineWorkOutline } from "react-icons/md"
import { IoBusinessOutline, IoNewspaperOutline } from "react-icons/io5"
import { RiRoadMapLine } from "react-icons/ri"

import InfoCard from "./info-card"

export default function Presentation() {
    return (
        <Container
            className="d-flex flex-column align-items-center"
            style={{ margin: "80px auto" }}
        >
            <div className="text-center">
                <h2>Uma plataforma completa para o mercado de trabalho</h2>
                <span className="fs-4">Soluções para simplificar a conexão entre candidatos e empresas</span>
            </div>

            <div className="row row-gap-2 mt-5">
                <div className="col-lg-3">
                    <InfoCard
                        icon={<MdOutlineWorkOutline className="fs-1" />}
                        title="Para Candidatos"
                        text="Inscrições rápidas e ágeis, conectadas com a plataforma oficial de empregos da prefeitura de Muriaé."
                    />
                </div>

                <div className="col-lg-3">
                    <InfoCard
                        icon={<IoBusinessOutline className="fs-1" />}
                        title="Para Empresas"
                        text="Publicação de vagas simplificadas e ampla oferta de profissionais regionais."
                    />
                </div>

                <div className="col-lg-3">
                    <InfoCard
                        icon={<IoNewspaperOutline className="fs-1" />}
                        title="Processo Simplificado"
                        text="Etapas concisas, conscientes e humanas para candidatos e recrutadores, em uma interface intuitiva e ágil."
                    />
                </div>

                <div className="col-lg-3">
                    <InfoCard
                        icon={<RiRoadMapLine className="fs-1" />}
                        title="Foco Regional"
                        text="Específico para Muriaé e região, preservando a prioridade e proximidade entre empresas e profissionais."
                    />
                </div>
            </div>
        </Container>
    )
}
