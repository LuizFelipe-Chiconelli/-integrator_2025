import ApplicationRow from "./row"

import "./table.css"

export default function ApplicationTable() {
    return (
        <table className="w-100">
            <thead className="border-bottom">
                <tr style={{ height: "40px" }}>
                    <th className="text-light-emphasis ps-2">Vaga</th>
                    <th className="text-dark-emphasis">Empresa</th>
                    <th className="text-dark-emphasis">Data</th>
                    <th className="text-dark-emphasis">Status</th>
                    <th className="text-dark-emphasis text-end pe-3">Ações</th>
                </tr>
            </thead>

            <tbody>
                <ApplicationRow />
                <ApplicationRow />
                <ApplicationRow />
                <ApplicationRow />
                <ApplicationRow />
            </tbody>
        </table>
    )
}