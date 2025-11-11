import type { Application } from "@/types/jobs"

import { LuBuilding } from "react-icons/lu"
import { Badge, Button } from "react-bootstrap"
import { MdOutlineDateRange } from "react-icons/md"

const status: Record<number, string> = {
    11: "Pendente",
    12: "Em análise",
    13: "Aprovada",
    14: "Reprovada",
    15: "Contratado",
    16: "Abandonado"
}

interface Props {
    info: Application
    onClick: () => void
}

export default function ApplicationRow({ info, onClick }: Props) {
    const dateString: string = new Date(`${info.dtFim}T00:00:00`).toLocaleDateString("pt-BR", { timeZone: "UTC" })

    return (
        <tr className="text-dark-emphasis border-bottom" style={{ height: '60px' }}>
            <td className="col-3 ps-2">{info.titulo}</td>
            <td className="col-3"><LuBuilding className="mb-1" /> {info.empresa_nome}</td>
            <td className="col-2"><MdOutlineDateRange className="mb-1" /> {dateString}</td>
            <td><Badge bg="warning" className="text-warning-emphasis">{status[info.statusCandidatura]}</Badge></td>
            <td className="text-end pe-3">
                <Button className="btn-light border" onClick={onClick}>Visualizar</Button>
            </td>
        </tr>
    )
}