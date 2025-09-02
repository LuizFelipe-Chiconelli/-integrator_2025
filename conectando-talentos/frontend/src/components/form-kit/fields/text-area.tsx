'use client'

import { FieldMethods, FieldRef } from "@/types/form"

import { useFormContext } from "../context"
import { useRef, useImperativeHandle, useEffect, useState } from "react"

interface Props {
    ref?: React.Ref<FieldMethods>
    name: string
    label?: string
    placeholder?: string
    required?: boolean
}

export default function TextAreaField({ ref, name, label, placeholder = "", required }: Props) {

    // Hooks
    const inputRef = useRef<HTMLTextAreaElement>(null)

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
        <div className="flex flex-col">
            {label && (
                <label htmlFor={`input-${name}`} className="ml-2">{label}</label>
            )}
            <textarea
                id={`input-${name}`}
                ref={inputRef}
                name={name}
                placeholder={placeholder}
                className={`min-h-28 border rounded-sm focus:outline-1 px-4 py-1
                ${error ? "border-red-500 outline-red-500 outline-1" : ""}`}
            />
            {error && (
                <span className="text-red-500 text-sm mt-1 ml-2">{error}</span>
            )}
        </div>
    )
}