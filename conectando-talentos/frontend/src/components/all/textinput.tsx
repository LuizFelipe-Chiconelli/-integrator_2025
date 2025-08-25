// src/components/all/textinput.tsx
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Form } from "react-bootstrap";
import type { Color } from "react-bootstrap/esm/types";
import type { InputHandler } from "@/types/inputs";

/** Props nativas de Form.Control, mas sem size, id e ref */
type BootstrapProps = Omit<
  React.ComponentProps<typeof Form.Control>,
  "size" | "id" | "ref"
>;

interface Props extends BootstrapProps {
  /** id único do campo – obrigatório */
  id: string;
  label?: string;
  bg?: Color;
  htmlSize?: number;
  /** vai no Form.Group (não vaza pro DOM) */
  controlId?: string;
  /** mensagem de erro/validação opcional */
  feedback?: string;
}

/**
 * TextInput com forwardRef:
 * - getValue/setValue via ref
 * - usa Form.Group para controlId (sem warning)
 * - aceita isInvalid/feedback
 */
const TextInput = forwardRef<InputHandler, Props>(function TextInput(
  { id, label, bg = "light", htmlSize, className, controlId, feedback, isInvalid, ...rest },
  ref
) {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    getValue: () => inputRef.current?.value ?? "",
    setValue: (val: string) => {
      if (inputRef.current) inputRef.current.value = val;
    },
  }));

  return (
    <Form.Group controlId={controlId} className="mb-3">
      {label && (
        <Form.Label htmlFor={id} className="fw-semibold mb-1 ms-1" style={{ fontSize: 14 }}>
          {label}
        </Form.Label>
      )}

      <Form.Control
        id={id}
        ref={inputRef}
        type="text"
        isInvalid={isInvalid}
        {...rest}
        {...(htmlSize !== undefined ? { htmlSize } : {})}
        className={`bg-${bg} ${className ?? ""}`.trim()}
      />

      {feedback && (
        <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
          {feedback}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
});

export default TextInput;
