'use client'

import { Form } from "react-bootstrap"
import { useFormContext } from "../context"
import { useRef, useImperativeHandle, useState, useEffect } from "react"

import type { Color } from "react-bootstrap/esm/types"
import type { FieldMethods, FieldRef, Option } from "../types"

interface Props {
    ref?: React.Ref<FieldMethods>
    id: string
    bg?: Color
    name: string
    label?: string
    className?: string
    options: Option[]
    disabled?: boolean
    required?: boolean
    initialValue?: string
}

export default function SelectField({ ref, id, bg = "light", name, label, className, options, disabled = false, required, initialValue }: Props) {

    // Hooks
    const inputRef = useRef<HTMLSelectElement>(null)

    const [error, setError] = useState<string | null>(null)
    const { registerField, unregisterField } = useFormContext()

    // Funções internas

    const validate = (): boolean => {
        if (required && !inputRef.current?.value) {
            setError('Este campo não pode ficar vazio!')
            return false
        }

        setError(null)
        return true
    }

    const getValue = (): string => {
        return inputRef.current?.value ?? ""
    }

    const setValue = (val: string): void => {
        if (inputRef?.current) {
            inputRef.current.value = val
        }
    }

    // Controle

    useImperativeHandle(ref, () => {
        return {
            getValue,
            setValue,
            validate
        }
    }, [])

    useEffect(() => {
        if (initialValue) setValue(initialValue)
    }, [])

    useEffect(() => {
        const fieldRef: FieldRef = {
            current: {
                getValue,
                setValue,
                validate
            }
        }

        registerField(name, fieldRef)

        return () => {
            unregisterField(name)
        }
    }, [name, registerField, unregisterField])

    return (
        <Form.Group className="mb-3">
            {label && (
                <Form.Label htmlFor={id} className="fw-semibold mb-1 ms-1" style={{ fontSize: 14 }}>
                    {label}
                </Form.Label>
            )}

            <Form.Select
                id={id}
                ref={inputRef}
                disabled={disabled}
                className={`bg-${bg} ${className ?? ""}`.trim()}
            >
                {options && options.map((opt, index) => {
                    return (<option
                        key={index}
                        value={opt.id}
                    >
                        {opt.label}
                    </option>)
                })}
            </Form.Select>

            {error && (
                <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
                    {error}
                </Form.Control.Feedback>
            )}
        </Form.Group>
    )
}