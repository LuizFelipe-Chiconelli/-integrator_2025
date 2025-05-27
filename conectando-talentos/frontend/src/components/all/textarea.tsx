import { Form } from "react-bootstrap"
import type { Color } from "react-bootstrap/esm/types"

interface Props {
    controlId: string,
    label?: string,
    placeholder: string,
    required?: boolean,
    bg?: Color
}

export default function TextArea({ controlId, label, placeholder, bg, required }: Props) {
    return (
        <Form.Group controlId={controlId} className="mb-3">
            {label && (
                <Form.Label className="fw-semibold mb-1 ms-1" style={{ fontSize: "14px" }}>{label}</Form.Label>
            )}
            <Form.Control
                as="textarea"
                placeholder={placeholder}
                className={`bg-${bg ?? "light"}`}
                style={{ height: "100px" }}
                {...required ? { required } : {}}
            />
        </Form.Group>
    )
}