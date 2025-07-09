import { forwardRef, useImperativeHandle, useRef } from "react";
import { Form } from "react-bootstrap";
import type { InputHandler } from "@/types/inputs";

interface TextAreaProps {
  controlId : string;
  label     : string;
  placeholder?: string;
  required ?: boolean;
}

const TextArea = forwardRef<InputHandler, TextAreaProps>(
  ({ controlId, label, placeholder, required }, ref) => {

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    /* ❶ — agora expõe ambos os métodos */
    useImperativeHandle(ref, () => ({
      getValue: () => textAreaRef.current?.value ?? "",
      setValue: (val: string) => {
        if (textAreaRef.current) {
          textAreaRef.current.value = val;
        }
      }
    }));

    /* ❷ — JSX */
    return (
      <Form.Group controlId={controlId} className="mb-3">
        {label && <Form.Label>{label}</Form.Label>}
        <Form.Control
          as="textarea"
          ref={textAreaRef}
          placeholder={placeholder}
          required={required}
          rows={4}
        />
      </Form.Group>
    );
  }
);

export default TextArea;
