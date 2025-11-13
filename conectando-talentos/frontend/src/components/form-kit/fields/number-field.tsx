'use client'

import type { FieldMethods, FieldRef } from "@/components/form-kit/types"

import { useFormContext } from "../context"
import { useRef, useImperativeHandle, useState, useEffect } from "react"
import { Form } from "react-bootstrap"
import type { Color } from "react-bootstrap/esm/types"

interface Props {
	ref?: React.Ref<FieldMethods>
	id: string
	bg?: Color
	name: string
	label?: string
	placeholder?: string
	className?: string
	disabled?: boolean
    maxLenght?: number
	required?: boolean
	initialValue?: string
}

export default function NumberField({ ref, id, bg = "light", name, label, placeholder = "", className, disabled = false, maxLenght, required, initialValue }: Props) {

    // Hooks
    const inputRef = useRef<HTMLInputElement>(null)

    const [error, setError] = useState<string | null>(null)
    const { registerField, unregisterField } = useFormContext()

    // Funções internas

    const format = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.value = e.target.value.replace(/\D/g, '')
    }

    const validate = (): boolean => {
        if (required && !inputRef.current?.value) {
            setError('Este campo não pode ficar vazio!')
            return false
        }

        setError(null)
        return true
    }

    const getValue = (): number | null => {
        return Number(inputRef.current?.value.replace(/\D/, '')) || null
    }

    const setValue = (val: number | string | null): void => {
        if (inputRef?.current && val) {
            inputRef.current.value = String(val).replace(/\D/, '')
        }
    }

    // Controle

    useImperativeHandle(ref, () => {
        return {
            getValue,
            validate
        }
    }, [])

    useEffect(() => {
        if (initialValue) {
            setValue(initialValue)
        }
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

			<Form.Control
				id={id}
				ref={inputRef}
				type="text"
				placeholder={placeholder}
				className={`bg-${bg} ${className ?? ""}`.trim()}
                onChange={format}
				disabled={disabled}
                {...maxLenght ? { maxLength: maxLenght } : {}}
			/>

			{error && (
				<Form.Control.Feedback type="invalid" style={{ display: "block" }}>
					{error}
				</Form.Control.Feedback>
			)}
		</Form.Group>
    )
}