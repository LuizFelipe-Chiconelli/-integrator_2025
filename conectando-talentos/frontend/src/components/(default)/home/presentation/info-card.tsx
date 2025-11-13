import React from "react"

import { Card } from "react-bootstrap"
import { Link } from "react-router-dom"

interface Props {
    icon?: React.ReactNode,
    title?: string,
    link?: string,
    text?: string
}

export default function InfoCard({ icon, title, link, text }: Props) {
    return (
        <Card className="h-100 text-center">
            <Card.Body className="d-flex flex-column align-items-center gap-2">
                {icon}

                <Link to={String(link)} className="text-decoration-none">
                    <span className="fw-bold fs-4">{title}</span>
                </Link>

                <p>{text}</p>
            </Card.Body>
        </Card>
    )
}