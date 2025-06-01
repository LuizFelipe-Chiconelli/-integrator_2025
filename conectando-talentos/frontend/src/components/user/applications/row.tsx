import { Badge, Button } from "react-bootstrap"

import { LuBuilding } from "react-icons/lu"
import { MdOutlineDateRange } from "react-icons/md"

export default function ApplicationRow() {
    return (
        <tr className="text-dark-emphasis border-bottom" style={{ height: '60px' }}>
            <td className="col-3 ps-2">Desenvolvedor Full-stack</td>
            <td className="col-3"><LuBuilding className="mb-1"/> Tech Corp</td>
            <td className="col-2"><MdOutlineDateRange className="mb-1" /> {new Date().toLocaleDateString('pt-br')}</td>
            <td><Badge bg="warning" className="text-warning-emphasis">Pendente</Badge></td>
            <td className="text-end pe-3"><Button className="btn-light border">Vizualizar</Button></td>
        </tr>
    )
}