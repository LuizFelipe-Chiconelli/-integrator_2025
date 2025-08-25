// src/components/all/select.tsx
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Form } from "react-bootstrap";
import type { Option, InputHandler } from "@/types/inputs";

export interface SelectProps {
  controlId: string;                 // usado no Form.Group (sem warning)
  label: string;
  options: Option[] | readonly Option[];
  required?: boolean;
  onChange?: (value: string) => void;

  // ✅ novos (controlado e UX)
  value?: string | number;           // permite <Select value={...} />
  placeholder?: string;              // ex.: "Selecione"
  disabled?: boolean;
  className?: string;
  isInvalid?: boolean;
  feedback?: string;                 // mensagem de erro
}

const Select = forwardRef<InputHandler, SelectProps>(function Select(
  {
    controlId,
    label,
    options,
    required,
    onChange,

    value,
    placeholder,
    disabled,
    className,
    isInvalid,
    feedback,
  },
  ref
) {
  const selectRef = useRef<HTMLSelectElement>(null);

  // expõe getValue / setValue
  useImperativeHandle(ref, () => ({
    getValue: () => selectRef.current?.value ?? "",
    setValue: (val: string) => {
      if (selectRef.current) selectRef.current.value = val;
    },
  }));

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.currentTarget.value);
  };

  return (
    <Form.Group controlId={controlId} className={`mb-3 ${className ?? ""}`.trim()}>
      {label && <Form.Label>{label}</Form.Label>}

      <Form.Select
        ref={selectRef}
        value={value ?? ""}          // ✅ componente controlado
        onChange={handleChange}
        required={required}
        disabled={disabled}
        isInvalid={isInvalid}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={String(opt.id)} value={String(opt.id)}>
            {opt.displayName}
          </option>
        ))}
      </Form.Select>

      {feedback && (
        <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
          {feedback}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
});

export default Select;
