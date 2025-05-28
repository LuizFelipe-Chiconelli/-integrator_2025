import type { Color } from "react-bootstrap/esm/types"

import { Form } from "react-bootstrap"

interface Props {
    controlId: string,
    label?: string,
    required?: boolean,
    bg?: Color
}

export default function FileInput({ controlId, label, bg, required }: Props) {
    return (
        <Form.Group controlId={controlId} className="mb-3">
            {label && (
                <Form.Label className="fw-semibold mb-1 ms-1" style={{ fontSize: "14px" }}>{label}</Form.Label>
            )}
            <Form.Control
                type="file"
                className={`bg-${bg ?? "light"}`}
                {...required ? { required } : {}}
            />
        </Form.Group>
    )
}