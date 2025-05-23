import { Form } from "react-bootstrap"

interface Props {
    controlId: string,
    label: string,
    placeholder: string,
    required?: boolean
}

export default function Select({ controlId, label, placeholder, required }: Props) {
    return (
        <Form.Group controlId={controlId} className="mb-3">
            <Form.Label className="fw-semibold mb-1">{label}</Form.Label>
            <Form.Select
                className="bg-light"
                defaultValue="null"
                {...required ? {required} : {}}
            >
                <option value="null">{placeholder}</option>
            </Form.Select>
        </Form.Group>
    )
}