import { Form } from "react-bootstrap"
import { createContext, useContext, useRef } from "react"

import type { FieldRef, FieldRegistry, FormContextType } from "./types"

export const FormContext = createContext<FormContextType | undefined>(undefined)

interface Props {
    id?: string
    className?: string
    onSubmit: (formData: Record<string, any>) => void
    children: React.ReactNode | React.ReactNode[]
}

export const useFormContext = () => {
    const context = useContext(FormContext)

    if (!context) {
        throw new Error('useFormContext deve ser uilizado dentro de um FormProvider')
    }

    return context
}

export default function FormProvider({ children, id, className, onSubmit }: Props) {
    const fieldsRef = useRef<FieldRegistry>({})

    const registerField = (name: string, ref: FieldRef) => {
        fieldsRef.current[name] = ref
    }

    const unregisterField = (name: string) => {
        delete fieldsRef.current[name]
    }

    const validateForm = (): boolean => {
        let isValid = true
        const fields = fieldsRef.current

        Object.entries(fields).forEach(([_, ref]) => {
            const field = ref.current

            if (!field.validate()) {
                isValid = false
            }
        })

        return isValid
    }

    const getFormData = (): Record<string, any> => {
        const formData: Record<string, any> = {}
        const fields = fieldsRef.current

        Object.entries(fields).forEach(([name, ref]) => {
            formData[name] = ref.current?.getValue()
        })

        return formData
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (validateForm()) {
            onSubmit(getFormData())
        }
    }

    return (
        <FormContext.Provider value={{ registerField, unregisterField }}>
            <Form
                {...id ? { id } : {}}
                {...className ? { className } : {}}
                onSubmit={handleSubmit}
            >
                {children}
            </Form>
        </FormContext.Provider>
    )
}
