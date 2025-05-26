import { Badge, Button } from "react-bootstrap"

export default function ApplicationRow() {
    return (
        <tr className="text-dark-emphasis border-bottom" style={{ height: '60px' }}>
            <td className="col-3 ps-2">John Doe</td>
            <td className="col-4">Desenvolvedor Full-stack</td>
            <td className="col-2">{new Date().toLocaleDateString('pt-br')}</td>
            <td><Badge bg="warning" className="text-warning-emphasis">Pendente</Badge></td>
            <td className="text-end pe-3"><Button className="btn-light border">Vizualizar</Button></td>
        </tr>
    )
}