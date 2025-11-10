import type { CandidateApplication } from "@/types/jobs"

import { Badge, Button } from "react-bootstrap"

const status: Record<number, string> = {
    11: "Pendente",
    12: "Em análise",
    13: "Aprovada",
    14: "Reprovada",
    15: "Contratado"
}

interface Props {
    info: CandidateApplication
    onClick: () => void
}

export default function ApplicationRow({ info, onClick }: Props) {
    const dateString: string = new Date(info.dataCandidatura).toLocaleDateString("pt-BR", { timeZone: "UTC" })

    return (
        <tr className="text-dark-emphasis border-bottom" style={{ height: '60px' }}>
            <td className="col-3 ps-2">{info.candidato_nome}</td>
            <td className="col-4">{info.titulo}</td>
            <td className="col-2">{dateString}</td>
            <td><Badge bg="warning" className="text-warning-emphasis">{status[info.statusCandidatura]}</Badge></td>
            <td className="text-end pe-3"><Button className="btn-light border">Visualizar</Button></td>
        </tr>
    )
}