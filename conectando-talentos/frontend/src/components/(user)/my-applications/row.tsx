import type { Application } from "@/types/jobs"
import { Badge, Button } from "react-bootstrap"

import { LuBuilding } from "react-icons/lu"
import { MdOutlineDateRange } from "react-icons/md"

interface Props {
    info: Application
}

export default function ApplicationRow({ info }: Props) {
    const dateString: string = new Date(`${info.dtFim}T00:00:00`).toLocaleDateString("pt-BR", { timeZone: "UTC" })

    return (
        <tr className="text-dark-emphasis border-bottom" style={{ height: '60px' }}>
            <td className="col-3 ps-2">{info.titulo}</td>
            <td className="col-3"><LuBuilding className="mb-1" /> {info.empresa_nome}</td>
            <td className="col-2"><MdOutlineDateRange className="mb-1" /> {dateString}</td>
            <td><Badge bg="warning" className="text-warning-emphasis">{info.statusCandidatura}</Badge></td>
            <td className="text-end pe-3"><Button className="btn-light border">Visualizar</Button></td>
        </tr>
    )
}