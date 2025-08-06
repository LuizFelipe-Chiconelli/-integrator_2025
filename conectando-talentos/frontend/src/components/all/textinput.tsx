import { forwardRef, useImperativeHandle, useRef } from "react";
import { Form } from "react-bootstrap";
import type { Color } from "react-bootstrap/esm/types";
import type { InputHandler } from "@/types/inputs";

/* props nativos de Form.Control,
   menos size (sm / lg) e id (vamos declarar de novo) */
type BootstrapProps = Omit<
  React.ComponentProps<typeof Form.Control>,
  "size" | "id"
>;

interface Props extends BootstrapProps {
  /** id único do campo  –  agora realmente obrigatório */
  id: string;
  label?: string;
  bg?: Color;
  htmlSize?: number;
}

/* -------------------------------------------------- */

function TextInput(
  { id, label, bg = "light", htmlSize, className, ...rest }: Props,
  ref: React.Ref<InputHandler>
) {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    getValue: () => inputRef.current?.value ?? "",
    setValue: val => {
      if (inputRef.current) inputRef.current.value = val;
    }
  }));

  return (
    <Form.Group className="mb-3">
      {label && (
        <Form.Label
          htmlFor={id}
          className="fw-semibold mb-1 ms-1"
          style={{ fontSize: 14 }}
        >
          {label}
        </Form.Label>
      )}

      <Form.Control
        id={id}
        ref={inputRef}
        type="text"
        {...rest}
        {...(htmlSize !== undefined ? { htmlSize } : {})}
        className={`bg-${bg} ${className ?? ""}`.trim()}
      />
    </Form.Group>
  );
}

export default forwardRef<InputHandler, Props>(TextInput);
