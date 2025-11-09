import { Link } from "react-router-dom"
import { Badge, Button, Card } from "react-bootstrap"

import type { Job } from "@/types/jobs"

interface Props {
    job: Job
}

export default function JobCard({ job }: Props) {
    // const skills: Array<string> = JSON.parse(job.requisitos).slice(0, 4)
    const minSalario: string = Number(job.salario_minimo).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
	const maxSalario: string = Number(job.salario_minimo).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

	const dateString: string = new Date(`${job.dtFim}T00:00:00`).toLocaleDateString("pt-BR", { timeZone: "UTC" })

    return (
        <Card className="h-100">
            <Card.Header>
                <div className="d-flex align-items-center gap-2">
                    <img
                        className="enterprise-logo border border-dark-subtle"
                        src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
                        alt={String(job.estabelecimento_id)}
                        style={{
                            width: "50px",
                            borderRadius: "50%"
                        }}
                    />

                    <div>
                        <span>{job.empresa_nome}</span>
                    </div>
                </div>
            </Card.Header>
            <Card.Body className="d-flex flex-column gap-2 py-3">
                <Link to='#' className="text-decoration-none">
                    <h3 className="text-primary fs-5 mb-0">{job.cargo_descricao}</h3>
                </Link>

                <div>
                    <span>{job.localizacao}</span>
                </div>

                <div className="d-flex flex-wrap gap-1">
                    <Badge
                        bg="light"
                        className="border text-success"
                        style={{ fontSize: "11px" }}
                    >
                        {minSalario} - {maxSalario}
                    </Badge>
                    <Badge
                        bg="light"
                        className="border text-dark"
                        style={{ fontSize: "11px" }}
                    >
                        até {dateString}
                    </Badge>
                </div>

            </Card.Body>
            <Card.Footer>
                <div>
                    <Button href={`/vaga/${job.vaga_id}`}>Ver Detalhes</Button>
                </div>
            </Card.Footer>
        </Card>
    )
}