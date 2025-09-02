'use client'

import { FieldMethods, FieldRef } from "@/types/form"

import { useFormContext } from "../context"
import { useState, useRef, useImperativeHandle, useEffect } from "react"

interface Props {
    ref?: React.Ref<FieldMethods>
    name: string
    label?: string
    placeholder?: string
    required?: boolean
}

export default function PhoneField({ ref, name, label, placeholder = "", required }: Props) {

    // Hooks
    const inputRef = useRef<HTMLInputElement>(null)

    const [error, setError] = useState<string | null>(null)
    const { registerField, unregisterField } = useFormContext()

    // Funções internas

    const validate = (): boolean => {
        if (required && !inputRef.current?.value) {
            setError('Este campo não pode ficar vazio!')
            return false
        }

        if (inputRef.current?.value && !(inputRef.current.value.length >= 14)) {
            setError('Digite um número de telefone válido!')
            return false
        }

        setError(null)
        return true
    }

    const getValue = (): string => {
        return inputRef.current?.value ?? ""
    }

    const phoneFormat = (e: React.ChangeEvent) => {
        e.preventDefault()
        if (inputRef.current?.value) {
            inputRef.current.value = inputRef.current.value.replace(/\D/g, '').replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3")
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
                onChange={phoneFormat}
                maxLength={15}
            />
            {error && (
                <span className="text-red-500 text-sm mt-1 ml-2">{error}</span>
            )}
        </div>
    )
}