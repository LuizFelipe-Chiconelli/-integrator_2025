import type { RefObject } from "react"

export interface FieldMethods {
    getValue: () => any
    validate: () => boolean
    setValue?: (val: any) => void
} 

export type FieldRef = RefObject<FieldMethods>

export type FieldRegistry = Record<string, FieldRef>

export interface FormContextType {
    registerField: (name: string, ref: FieldRef) => void
    unregisterField: (name: string) => void
}

// Custom Select

export interface SelectDropdownRef {
    selectOption: () => void
    setFocusedIndex: React.Dispatch<React.SetStateAction<number>>
}

export interface Option {
    id: string | number
    label: string
}
