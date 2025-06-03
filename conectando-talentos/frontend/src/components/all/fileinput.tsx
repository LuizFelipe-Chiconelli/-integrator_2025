import type { Color } from "react-bootstrap/esm/types"

import { LuUpload } from "react-icons/lu"
import { Button, Form } from "react-bootstrap"

// Hooks
import { useRef } from "react"

interface Props {
    controlId: string,
    text: string,
    label?: string,
    bg?: Color
}

export default function FileInput({ controlId, text, label, bg }: Props) {
    const fileInput = useRef<HTMLInputElement>(null)

    const handleClick: React.MouseEventHandler = (e: React.MouseEvent<HTMLInputElement>) => {
        e.preventDefault()
        fileInput.current?.click()
    }

    return (
        <Form.Group controlId={controlId} className=" d-flex flex-column mb-3">
            {label && (
                <Form.Label className="fw-semibold mb-1 ms-1" style={{ fontSize: "14px" }}>{label}</Form.Label>
            )}

            <Form.Control
                ref={fileInput}
                type="file"
                className="d-none"
            />

            <Button
                className="d-flex align-items-center border gap-2"
                variant={bg ?? "light"}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => { handleClick(e) }}
            >
                <div>
                    <LuUpload />
                </div>

                <div className="w-100 me-2">
                    {text}
                </div>
            </Button>
        </Form.Group>
    )
}