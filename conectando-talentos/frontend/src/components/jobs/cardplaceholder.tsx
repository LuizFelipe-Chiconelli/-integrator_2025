import { Card, Placeholder } from "react-bootstrap"

export default function CardPlaceholder() {
    return (
        <Card className="h-100">
            <Card.Header className="py-4" />

            <Card.Body className="d-flex flex-column gap-2 py-3">

                <Placeholder as={Card.Text} animation="glow">
                    <Placeholder xs={7} />
                </Placeholder>

                <Placeholder as={Card.Text} animation="glow">
                    <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                    <Placeholder xs={6} /> <Placeholder xs={8} />
                </Placeholder>

            </Card.Body>

            <Card.Footer>
                <Placeholder.Button variant="primary" xs={6} />
            </Card.Footer>
        </Card>
    )
}