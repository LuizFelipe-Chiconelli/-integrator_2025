'use client'

import { FieldMethods, FieldRef, Option, SelectDropdownRef } from "@/types/form"

import { handleSelectKeyDown } from "./utils"
import { useFormContext } from "../../context"
import { useRef, useImperativeHandle, useState, useEffect } from "react"

import { FaChevronDown } from "react-icons/fa"
import { IoCloseSharp } from "react-icons/io5"

import Dropdown from "./dropdown"

interface Props {
    ref?: React.Ref<FieldMethods>
    name: string
    label?: string
    options?: Option[]
    placeholder?: string
    required?: boolean
}

export default function SelectField({ ref, name, label, options, placeholder = "", required }: Props) {

    // Hooks
    const inputRef = useRef<HTMLInputElement>(null)
    const elementRef = useRef<HTMLDivElement>(null)
    const dropdownRef = useRef<SelectDropdownRef>(null)

    const [isOpened, setIsOpened] = useState<boolean>(false)
    const [selectedOption, setSelectedOption] = useState<Option | null>(null)

    const [text, setText] = useState<string>("")
    const [error, setError] = useState<string | null>(null)
    const { registerField, unregisterField } = useFormContext()

    // Funções internas

    const validate = (): boolean => {
        if (required && !selectedOption) {
            setError('Este campo não pode ficar vazio!')
            return false
        }

        setError(null)
        return true
    }

    const getValue = (): Option | null => {
        return selectedOption
    }

    // Funcionamento interno do custom select

    const filteredOptions = options?.filter((opt: Option) => {
        let t = text.trim().toLowerCase()
        return opt.label.trim().toLowerCase().includes(t) || opt.sublabel?.trim().toLowerCase().includes(t)
    }) || []

    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        handleSelectKeyDown(
            e,
            isOpened,
            setIsOpened,
            dropdownRef,
            inputRef,
            filteredOptions.length
        )
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!elementRef.current?.contains(e.target as Node)) {
                setIsOpened(false)
            }
        }

        document.addEventListener("click", handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

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
    }, [name, registerField, unregisterField, selectedOption])

    useEffect(() => {
        dropdownRef.current?.setFocusedIndex(0)
    }, [text])

    return (
        <div
            className="flex flex-col"
        >
            {label && (
                <label htmlFor={`input-${name}`} className="ml-2">{label}</label>
            )}

            {/* Custom Select Input */}
            <div
                ref={elementRef}
                className="relative w-full flex border-1 rounded-sm focus:outline-1 focus-within:outline-1"
                onKeyDown={onKeyDown}
                onClick={() => { setIsOpened(!isOpened) }}
                aria-haspopup="listbox"
                role="combobox"
                tabIndex={0}
            >
                <input
                    type="text"
                    ref={inputRef}
                    className="w-full outline-none border-none px-4 py-1"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setText(e.target.value) }}
                    placeholder={selectedOption?.label ?? placeholder}
                    tabIndex={-1}
                />

                {/* Clear select */}
                {selectedOption && (
                    <div
                        className="flex items-center justify-center px-2 my-2
                        cursor-pointer hover:[&_svg]:text-secondary"
                        onClick={(e: React.MouseEvent<HTMLDivElement>) => { setSelectedOption(null) }}
                    >
                        <IoCloseSharp size={13} className="text-default-border" />
                    </div>
                )}

                <div
                    className="flex items-center justify-center border-l px-2 my-2 mr-1
                    cursor-pointer hover:[&_svg]:text-secondary"
                >
                    <FaChevronDown size={12} className="text-default-border" />
                </div>

                {/* Dropdown */}
                {isOpened && (
                    <Dropdown
                        ref={dropdownRef}
                        options={filteredOptions}
                        setIsOpened={setIsOpened}
                        setSelectedOption={setSelectedOption}
                    />
                )}
            </div>

            {error && (
                <span className="text-red-500 text-sm mt-1 ml-2">{error}</span>
            )}
        </div>
    )
}