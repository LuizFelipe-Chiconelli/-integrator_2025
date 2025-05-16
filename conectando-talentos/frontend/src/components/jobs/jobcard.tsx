import { Badge, Button, Card } from "react-bootstrap"
import { Link } from "react-router-dom"

import type { Job } from "../../types/job"

interface Props {
    job: Job
}

export default function JobCard({ job }: Props) {
    const skills: Array<string> = JSON.parse(job.qualifications).slice(0, 4)
    const salaryFrom: string = job.salary_from.toLocaleString("pt-br", { currency: "BRL" })
    const salaryTo: string = job.salary_to.toLocaleString("pt-br", { currency: "BRL" })

    return (
        <Card className="h-100">
            <Card.Header>
                <div className="d-flex align-items-center gap-2">
                    <img
                        className="enterprise-logo border border-dark-subtle"
                        src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
                        alt={job.company}
                        style={{
                            width: "50px",
                            borderRadius: "50%"
                        }}
                    />

                    <div>
                        <span>{job.company}</span>
                    </div>
                </div>
            </Card.Header>
            <Card.Body className="d-flex flex-column gap-2 py-3">
                <Link to='#' className="text-decoration-none">
                    <h3 className="text-primary fs-5 mb-0">{job.title}</h3>
                </Link>

                <div>
                    <span>{job.location}</span>
                </div>

                <div>
                    <Badge
                        bg="light"
                        className="border text-success"
                        style={{ fontSize: "11px" }}
                    >
                        R$ {salaryFrom} - R$ {salaryTo}
                    </Badge>
                    <Badge
                        bg="light"
                        className="border text-dark"
                        style={{ fontSize: "11px" }}
                    >
                        {String(job.created_at)}
                    </Badge>
                </div>

                <div className="d-flex flex-wrap gap-1">
                    {skills.map((skill: string, index: number) => {
                        return (
                            <Badge
                                bg="light"
                                className="border text-dark"
                                style={{ fontSize: "11px" }}
                                key={index}
                            >
                                {skill}
                            </Badge>
                        )
                    })}
                </div>

            </Card.Body>
            <Card.Footer>
                <div>
                    <Button>Ver Detalhes</Button>
                </div>
            </Card.Footer>
        </Card>
    )
}