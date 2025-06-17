import { Form } from "react-bootstrap"

// Hooks
import { useRef, useImperativeHandle } from "react"

// Tipos
import type { Color } from "react-bootstrap/esm/types"
import type { InputHandler } from "../../types/inputs"

// Definição de Props
interface Props {
    controlId: string,
    label?: string,
    placeholder: string,
    required?: boolean,
    ref?: React.Ref<InputHandler>,
    bg?: Color
}

export default function TextInput({ ref, controlId, label, placeholder, bg, required }: Props) {
    const inputRef = useRef<HTMLInputElement>(null)

    // Retornar valor
    useImperativeHandle(ref, () => {
        return {
            getValue() { return inputRef.current?.value ?? "" }
        }
    })

    return (
        <Form.Group controlId={controlId} className="mb-3">
            {label && (
                <Form.Label className="fw-semibold mb-1 ms-1" style={{ fontSize: "14px" }}>{label}</Form.Label>
            )}
            <Form.Control
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                className={`bg-${bg ?? "light"}`}
                {...required ? { required } : {}}
            />
        </Form.Group>
    )
}