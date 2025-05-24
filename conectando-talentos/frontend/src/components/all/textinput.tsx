import { Form } from "react-bootstrap"

interface Props {
    controlId: string,
    label: string,
    placeholder: string,
    required?: boolean
}

export default function TextInput({ controlId, label, placeholder, required }: Props) {
    return (
        <Form.Group controlId={controlId} className="mb-3">
            <Form.Label className="fw-semibold mb-1">{label}</Form.Label>
            <Form.Control
                type="text"
                placeholder={placeholder}
                className="bg-light"
                {...required ? {required} : {}}
            />
        </Form.Group>
    )
}