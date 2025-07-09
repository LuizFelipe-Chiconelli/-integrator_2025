import { Form } from "react-bootstrap"

interface Props {
    controlId: string,
    label: string,
    required?: boolean
}

export default function Check({ controlId, label, required }: Props) {
    return (
        <Form.Group controlId={controlId} className="mb-3">
            <Form.Check
                type="checkbox"
                label={label}
                {...required ? {required} : {}}
            />
        </Form.Group>
    )
}

