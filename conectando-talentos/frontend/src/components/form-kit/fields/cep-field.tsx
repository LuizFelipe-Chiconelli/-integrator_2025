'use client'

import type { Color } from "react-bootstrap/esm/types"
import type { FieldMethods, FieldRef } from "@/components/form-kit/types"

import { Form } from "react-bootstrap"
import { useFormContext } from "../context"
import { useRef, useImperativeHandle, useState, useEffect } from "react"

interface Props {
	ref?: React.Ref<FieldMethods>
	id: string
	bg?: Color
	name: string
	label?: string
	placeholder?: string
	className?: string
	disabled?: boolean
	required?: boolean
	initialValue?: string
}

export default function CEPField({ ref, id, bg = "light", name, label, placeholder = "", className, disabled = false, required, initialValue }: Props) {

    // Hooks
    const inputRef = useRef<HTMLInputElement>(null)

    const [error, setError] = useState<string | null>(null)
    const { registerField, unregisterField } = useFormContext()

    // Funções internas

    const format = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.value = e.target.value.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, "$1-$2")
    }

    const validate = (): boolean => {
        if (required && !inputRef.current?.value) {
            setError('Este campo não pode ficar vazio!')
            return false
        } else if (inputRef.current?.value && inputRef.current.value.length < 9) {
            setError('Digite um CEP completo!')
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
            inputRef.current.value = val.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, "$1-$2")
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

    useEffect(() => {
        if (initialValue) {
            setValue(initialValue)
        }
    }, [])

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
                maxLength={9}
				placeholder={placeholder}
				className={`bg-${bg} ${className ?? ""}`.trim()}
                onChange={format}
				disabled={disabled}
			/>

			{error && (
				<Form.Control.Feedback type="invalid" style={{ display: "block" }}>
					{error}
				</Form.Control.Feedback>
			)}
		</Form.Group>
    )
}