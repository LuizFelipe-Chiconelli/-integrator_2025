'use client'

import { Form } from "react-bootstrap"
import { useFormContext } from "../context"
import { useRef, useImperativeHandle, useState, useEffect } from "react"

import type { Color } from "react-bootstrap/esm/types"
import type { FieldMethods, FieldRef, Option } from "../types"

interface Props {
  ref?: React.Ref<FieldMethods>
  id: string
  bg?: Color
  name: string
  label?: string
  className?: string
  options: Option[]
  disabled?: boolean
  required?: boolean
  initialValue?: string
  /** NOVO: permite reagir à mudança do select (ex.: UF → recarregar cidades) */
  onChange?: (value: string) => void
}

export default function SelectField({
  ref,
  id,
  bg = "light",
  name,
  label,
  className,
  options,
  disabled = false,
  required,
  initialValue,
  onChange
}: Props) {

  // ===== Hooks
  const inputRef = useRef<HTMLSelectElement>(null)
  const [error, setError] = useState<string | null>(null)
  const { registerField, unregisterField } = useFormContext()

  // ===== Métodos do campo integrados ao FormProvider
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

  // ===== Expor métodos via ref
  useImperativeHandle(ref, () => {
    return { getValue, setValue, validate }
  }, [])

  // setar valor inicial (quando editar)
  useEffect(() => {
    if (initialValue !== undefined && initialValue !== null) {
      setValue(initialValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue])

  // registrar o campo no form
  useEffect(() => {
    const fieldRef: FieldRef = {
      current: { getValue, setValue, validate }
    }
    registerField(name, fieldRef)
    return () => unregisterField(name)
  }, [name, registerField, unregisterField])

  // tratar mudança (opcional)
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value)
  }

  return (
    <Form.Group className="mb-3">
      {label && (
        <Form.Label htmlFor={id} className="fw-semibold mb-1 ms-1" style={{ fontSize: 14 }}>
          {label}
        </Form.Label>
      )}

      <Form.Select
        id={id}
        ref={inputRef}
        disabled={disabled}
        className={`bg-${bg} ${className ?? ""}`.trim()}
        onChange={handleChange}
      >
        {options && options.map((opt, index) => (
          <option key={index} value={opt.id}>{opt.label}</option>
        ))}
      </Form.Select>

      {error && (
        <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  )
}
