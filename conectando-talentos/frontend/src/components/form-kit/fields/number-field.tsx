'use client'

import type { FieldMethods, FieldRef } from "../types"

import { useFormContext } from "../context"
import { useRef, useImperativeHandle, useState, useEffect } from "react"

interface Props {
    ref?: React.Ref<FieldMethods>
    name: string
    label?: string
    placeholder?: string
    required?: boolean
}

export default function NumberField({ ref, name, label, placeholder = "", required }: Props) {

    // Hooks
    const inputRef = useRef<HTMLInputElement>(null)

    const [error, setError] = useState<string | null>(null)
    const { registerField, unregisterField } = useFormContext()

    // Funções internas

    const numberFormat = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.value = e.target.value.replace(/\D/, '')
    }

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

    // Controle

    useImperativeHandle(ref, () => {
        return {
            getValue,
            validate
        }
    }, [])

    useEffect(() => {
        const fieldRef: FieldRef = {
            current: {
                getValue,
                validate
            }
        }

        registerField(name, fieldRef)

        return () => {
            unregisterField(name)
        }
    }, [name, registerField, unregisterField])

    return (
        <div className="flex flex-col">
            {label && (
                <label htmlFor={`input-${name}`} className="ml-2">{label}</label>
            )}
            <input
                id={`input-${name}`}
                ref={inputRef}
                type="text"
                name={name}
                placeholder={placeholder}
                className={`border rounded-sm transition-all focus:outline-1 px-4 py-1
                ${error ? "border-red-500 outline-red-500 outline-1" : ""}`}
                onChange={numberFormat}
            />
            {error && (
                <span className="text-red-500 text-sm mt-1 ml-2">{error}</span>
            )}
        </div>
    )
}