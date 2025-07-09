import { forwardRef, useImperativeHandle, useRef } from "react";
import { Form } from "react-bootstrap";
import type { Color } from "react-bootstrap/esm/types";
import type { InputHandler } from "@/types/inputs";

/** Todos os props nativos de Form.Control,
 *  exceto `size` (sm / lg) que conflita com `size={number}` do HTML */
type Props = Omit<React.ComponentProps<typeof Form.Control>, "size"> & {
  label?: string;
  bg?: Color;
  /** se quiser usar size numérico do HTML use htmlSize */
  htmlSize?: number;
};

function TextInput(
  { label, bg = "light", htmlSize, ...rest }: Props,
  ref: React.Ref<InputHandler>
) {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    getValue: () => inputRef.current?.value ?? "",
    setValue: (val: string) => {
      if (inputRef.current) inputRef.current.value = val;
    },
  }));

  return (
    <Form.Group className="mb-3">
      {label && (
        <Form.Label
          className="fw-semibold mb-1 ms-1"
          style={{ fontSize: "14px" }}
        >
          {label}
        </Form.Label>
      )}

      <Form.Control
        ref={inputRef}
        type="text"
        className={`bg-${bg}`}
        {...(htmlSize !== undefined ? { htmlSize } : {})}
        {...rest}                                                
        />
    </Form.Group>
  );
}

export default forwardRef<InputHandler, Props>(TextInput);
