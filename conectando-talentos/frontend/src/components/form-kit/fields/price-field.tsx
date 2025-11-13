'use client'

import type { FieldMethods, FieldRef } from "../types"

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

export default function PriceField({ ref, id, bg = "light", name, label, placeholder = "", className, disabled = false, maxLenght, required, initialValue }: Props) {
    // Hooks
    const inputRef = useRef<HTMLInputElement>(null)

    const [error, setError] = useState<string | null>(null)
    const { registerField, unregisterField } = useFormContext()

    // Funções internas

    const format = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Converte para número e garante que estamos trabalhando com centavos
        const number = parseInt(e.target.value.replace(/\D/g, '') || '0');
        const cents = number.toString().padStart(3, '0');

        // Separa reais e centavos
        const realPart = cents.slice(0, -2) || '0';
        const centPart = cents.slice(-2);

        // Formata a parte dos reais com pontos
        const formattedReal = realPart
            .split('')
            .reverse()
            .join('')
            .replace(/(\d{3})(?=\d)/g, '$1.')
            .split('')
            .reverse()
            .join('');

        e.target.value = `${formattedReal},${centPart}`;
    }

    const validate = (): boolean => {
        if (required && (!inputRef.current?.value || inputRef.current?.value == "0,00")) {
            setError('Este campo não pode ficar vazio!')
            return false
        }

        setError(null)
        return true
    }

    const setValue = (val: string | null): void => {
        if (inputRef?.current && val) {
            const v: string = val.includes(',') ? val : `${val},00`
            const regex = /([0-9]*[\,]{0,1}[0-9]{0,2})/
            inputRef.current.value = v.match(regex)?.[0] || ""
        }
    }

    const getValue = (): string => {
        return inputRef.current?.value || ""
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