import { Form } from "react-bootstrap"
import type { Color } from "react-bootstrap/esm/types"

interface Props {
    controlId: string,
    label?: string,
    placeholder: string,
    required?: boolean,
    bg?: Color
}

export default function Select({ controlId, label, placeholder, bg, required }: Props) {
    return (
        <Form.Group controlId={controlId} className="mb-3">
            {label && (
                <Form.Label className="fw-semibold mb-1 ms-1" style={{ fontSize: "14px" }}>{label}</Form.Label>
            )}
            <Form.Select
                className={`bg-${bg ?? "light"}`}
                defaultValue="null"
                {...required ? { required } : {}}
            >
                <option value="null">{placeholder}</option>
            </Form.Select>
        </Form.Group>
    )
}