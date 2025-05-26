import { Form } from "react-bootstrap"

interface Props {
    controlId: string,
    label: string,
    placeholder: string,
    required?: boolean
}

export default function TextArea({ controlId, label, placeholder, required }: Props) {
    return (
        <Form.Group controlId={controlId} className="mb-3">
            <Form.Label className="fw-semibold mb-1 ms-1" style={{ fontSize: "14px" }}>{label}</Form.Label>
            <Form.Control
                as="textarea"
                placeholder={placeholder}
                className="bg-light"
                style={{ height: "100px" }}
                {...required ? {required} : {}}
            />
        </Form.Group>
    )
}