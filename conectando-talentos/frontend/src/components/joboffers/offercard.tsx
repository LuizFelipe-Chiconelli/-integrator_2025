import { Badge, Button, Card } from "react-bootstrap"
import { Link } from "react-router-dom"

import type { JobOffer } from "../../types/job"

import "./offercard.css"

interface Props {
    jobOffer: JobOffer
}

export default function OfferCard({ jobOffer }: Props) {
    const days: number = jobOffer.createdAt.getDate() - new Date().getDate()
    const timeString: string = days > 0 ? `Há ${days} dias` : 'Hoje'

    return (
        <Card className="h-100 py-2">
            <Card.Body className="d-flex flex-column gap-2">
                <div className="d-flex align-items-center gap-2">
                    <img
                        className="enterprise-logo border border-dark-subtle"
                        src={jobOffer.imageURL}
                        alt={jobOffer.enterprise.name}
                    />

                    <div>
                        <Link to='#' className="text-decoration-none">
                            <h3 className="text-primary fs-5 mb-0">{jobOffer.role.name}</h3>
                        </Link>
                        <span>{jobOffer.enterprise.name} - {jobOffer.city}, {jobOffer.uf}</span>
                    </div>
                </div>

                <div>
                    <Badge bg="light" className="border text-primary">{jobOffer.role.workhours}</Badge>
                </div>

                <div>
                    <Badge bg="light" className="border text-success">R$ {jobOffer.role.salary}</Badge> <Badge bg="light" className="border text-dark">{timeString}</Badge>
                </div>

                <div className="d-flex flex-wrap gap-1">
                    {jobOffer.skills.map(skill => {
                        return (
                            <Badge bg="light" className="border text-dark">{skill}</Badge>
                        )
                    })}
                </div>

                <div>
                    <Button>Ver Detalhes</Button>
                </div>
            </Card.Body>
        </Card>
    )
}