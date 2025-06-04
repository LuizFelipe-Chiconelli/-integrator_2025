import { Button, Card } from "react-bootstrap"

import { IoTimeOutline } from "react-icons/io5"
import { IoLocationOutline } from "react-icons/io5"
import { LuBuilding, LuDollarSign } from "react-icons/lu"

export default function JobCard() {
    return (
        <Card className="w-full">
            <Card.Body className="d-flex justify-content-between">
                {/* Esquerda */}
                <div className="d-flex flex-column">
                    {/* Título */}
                    <div className="d-flex flex-column">
                        <h3 className="fw-semibold mb-1" style={{ fontSize: "20px" }}>Desenvolvedor Frontend React</h3>
                        <div className="d-flex align-items-center gap-1">
                            <LuBuilding style={{ fontSize: "16px" }} />
                            <span style={{ fontSize: "14px" }}>Tech Corp</span>
                        </div>
                    </div>

                    {/* Descrição */}
                    <div className="text-6 mt-3" style={{ fontSize: "16px" }}>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo optio perferendis, sed ullam aspernatur excepturi necessitatibus, earum, unde cupiditate ex id. Nam sapiente vel dolore non minus architecto eligendi ab.</p>
                    </div>

                    {/* Informações rápidas */}
                    <div className="d-flex gap-3">
                        {/* Localização */}
                        <div className="d-flex align-items-center gap-2">
                            <IoLocationOutline /> Rio de Janeiro, RJ
                        </div>

                        {/* Salário */}
                        <div className="d-flex align-items-center gap-2">
                            <LuDollarSign /> R$ 6.000 - R$ 10.000
                        </div>

                        {/* Tempo desde a postagem */}
                        <div className="d-flex align-items-center gap-2">
                            <IoTimeOutline /> 1 dia atrás
                        </div>
                    </div>
                </div>

                {/* Direita */}
                <div className="w-25 d-flex justify-content-end align-items-start">
                    <Button style={{ fontSize: "15px" }}>Inscrever-se</Button>
                </div>
            </Card.Body>
        </Card>
    )
}