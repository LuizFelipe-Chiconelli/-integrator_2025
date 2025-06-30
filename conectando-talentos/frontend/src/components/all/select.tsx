import { Form } from "react-bootstrap"

// Hooks
import { useImperativeHandle, useRef } from "react"

// Tipos
import type { Color } from "react-bootstrap/esm/types"
import type { Option, InputHandler } from "@/types/inputs"

interface Props {
    controlId: string,
    options: Option[],
    label?: string,
    required?: boolean,
    ref?: React.Ref<InputHandler>,
    bg?: Color
}

export default function Select({ ref, controlId, label, bg, required, options }: Props) {
    const selectRef = useRef<HTMLSelectElement>(null)

    useImperativeHandle(ref, () => {
        return {
            getValue() { return selectRef.current?.value ?? "" }
        }
    })

    return (
        <Form.Group controlId={controlId} className="mb-3">
            {label && (
                <Form.Label className="fw-semibold mb-1 ms-1" style={{ fontSize: "14px" }}>{label}</Form.Label>
            )}
            <Form.Select
                ref={selectRef}
                className={`bg-${bg ?? "light"}`}
                defaultValue="null"
                {...required ? { required } : {}}
            >
                {options.map((opt: Option) => {
                    return (
                        <option key={opt.id} value={opt.id}>{opt.displayName}</option>
                    )
                })}
            </Form.Select>
        </Form.Group>
    )
}