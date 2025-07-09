import { forwardRef, useImperativeHandle, useRef } from "react";
import { Form } from "react-bootstrap";
import type { Option, InputHandler } from "@/types/inputs";

export interface SelectProps {
  controlId : string;
  label     : string;
  options   : Option[];
  required ?: boolean;
  onChange ?: (value: string) => void;   // ← adicionado
}

const Select = forwardRef<InputHandler, SelectProps>(
  ({ controlId, label, options, required, onChange }, ref) => {

    const selectRef = useRef<HTMLSelectElement>(null);

    /* ❶ — expõe getValue **e** setValue */
    useImperativeHandle(ref, () => ({
      getValue: () => selectRef.current?.value ?? "",
      setValue: (val: string) => {
        if (selectRef.current) {
          selectRef.current.value = val;
        }
      }
    }));

    /* ❷ — dispara callback opcional */
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value);
    };

    /* ❸ — JSX */
    return (
      <Form.Group controlId={controlId} className="mb-3">
        {label && <Form.Label>{label}</Form.Label>}

        <Form.Select
          ref={selectRef}
          required={required}
          onChange={handleChange}
        >
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.displayName}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    );
  }
);

export default Select;
