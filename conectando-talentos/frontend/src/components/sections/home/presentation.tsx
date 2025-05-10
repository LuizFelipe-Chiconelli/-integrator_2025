import { Container } from "react-bootstrap"

import { MdOutlineWorkOutline } from "react-icons/md"
import { IoBusinessOutline, IoNewspaperOutline } from "react-icons/io5"
import { RiRoadMapLine } from "react-icons/ri"

import InfoCard from "../../all/card"

import "./presentation.css"

export default function Presentation() {
    return (
        <Container id="presentation">
            <div className="text-center">
                <h2>Uma plataforma completa para o mercado de trabalho</h2>
                <span className="fs-4">Soluções para simplificar a conexão entre candidatos e empresas</span>
            </div>

            <div className="row mt-5">
                <div className="col-3">
                    <InfoCard
                        icon={<MdOutlineWorkOutline className="fs-1" />}
                        title="Para Candidatos"
                        text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum minus quidem aperiam consequuntur similique nam fuga voluptas officiis..."
                    />
                </div>

                <div className="col-3">
                    <InfoCard
                        icon={<IoBusinessOutline className="fs-1" />}
                        title="Para Empresas"
                        text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum minus quidem aperiam consequuntur similique nam fuga voluptas officiis..."
                    />
                </div>

                <div className="col-3">
                    <InfoCard
                        icon={<IoNewspaperOutline className="fs-1" />}
                        title="Parocesso Simplificado"
                        text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum minus quidem aperiam consequuntur similique nam fuga voluptas officiis..."
                    />
                </div>

                <div className="col-3">
                    <InfoCard
                        icon={<RiRoadMapLine className="fs-1" />}
                        title="Foco Regional"
                        text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum minus quidem aperiam consequuntur similique nam fuga voluptas officiis..."
                    />
                </div>
            </div>
        </Container>
    )
}
