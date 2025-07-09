import { forwardRef, useRef, useImperativeHandle } from "react"
import { Form } from "react-bootstrap"
import type { Color } from "react-bootstrap/esm/types"
import type { InputHandler } from "@/types/inputs"

interface Props {
  controlId: string
  label?: string
  placeholder?: string;
  required?: boolean
  bg?: Color
}

// Suporte a ref com forwardRef
const DateInput = forwardRef<InputHandler, Props>(
  ({ controlId, label, placeholder, required, bg }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => ({
  /* devolve a string que está no campo */
  getValue: () => inputRef.current?.value ?? "",

  /* grava um valor vindo do componente-pai */
  setValue: (val: string) => {
    if (inputRef.current) inputRef.current.value = val
  }
}))


    return (
      <Form.Group controlId={controlId} className="mb-3">
        {label && (
          <Form.Label className="fw-semibold mb-1 ms-1" style={{ fontSize: "14px" }}>
            {label}
          </Form.Label>
        )}
        <Form.Control
          ref={inputRef}
          type="date"
          placeholder={placeholder}
          className={`bg-${bg ?? "light"}`}
          {...(required ? { required } : {})}
        />
      </Form.Group>
    )
  }
)

export default DateInput
