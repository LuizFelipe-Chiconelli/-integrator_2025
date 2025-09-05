'use client'

import type { FieldMethods, FieldRef } from "../types"

import { useFormContext } from "../context"
import { useRef, useImperativeHandle, useState, useEffect } from "react"

import { MdFileUpload } from "react-icons/md"
import { IoCloseSharp } from "react-icons/io5"

interface Props {
    ref?: React.Ref<FieldMethods>
    name: string
    label?: string
    placeholder?: string
    acceptedFormats?: string
    required?: boolean
}

export default function FileInput({ ref, name, label, placeholder = "", acceptedFormats, required }: Props) {

    // Hooks
    const inputRef = useRef<HTMLInputElement>(null)

    const [value, setValue] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)
    const { registerField, unregisterField } = useFormContext()

    // Funções internas

    const validate = (): boolean => {
        if (required && !value) {
            setError('Este campo não pode ficar vazio!')
            return false
        }

        setError(null)
        return true
    }

    const getValue = (): File | null => {
        return value
    }

    const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        e.preventDefault()
        inputRef.current?.click()
    }

    const handleClear = (e: React.MouseEvent<HTMLDivElement>): void => {
        e.stopPropagation()
        e.preventDefault()

        if (inputRef.current?.files && inputRef.current.files.length > 0) {
            inputRef.current.value = ""
            setValue(null)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setValue(e.target.files[0] || null)
        }
    }

    // Controle

    useImperativeHandle(ref, () => {
        return {
            getValue,
            validate
        }
    }, [value])

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
    }, [name, registerField, unregisterField, value])

    return (
        <div className="flex flex-col">
            {label && (
                <label htmlFor={`input-${name}`} className="ml-2">{label}</label>
            )}
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept={acceptedFormats}
                />
            <div
                tabIndex={0}
                onClick={handleClick}
                className={`flex items-center border rounded-sm transition-all focus:outline-1 py-1
                hover:outline-1 cursor-pointer
                ${error ? "border-red-500 outline-red-500 outline-1" : ""}`}
            >
                <div className="pl-3 hover:[&_svg]:text-secondary">
                    <MdFileUpload size={18} className="text-default-border" />
                </div>

                <div className="w-full pl-2 pr-4">
                    <span className="text-black/50 pointer-events-none">
                        {value?.name ?? placeholder}
                    </span>
                </div>

                {value && (
                    <div className="pr-3 hover:[&_svg]:text-secondary" onClick={handleClear}>
                        <IoCloseSharp size={14} className="text-default-border" />
                    </div>
                )}
            </div>
            {error && (
                <span className="text-red-500 text-sm mt-1 ml-2">{error}</span>
            )}
        </div>
    )
}