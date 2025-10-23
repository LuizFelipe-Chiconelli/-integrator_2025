"use client";

import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

type FilterValue = { texto: string };
type Props = {
  /** opcional — se não vier, o componente funciona em modo controlado internamente */
  value?: FilterValue;
  /** opcional — chamado quando mudar; se não vier, atualiza estado interno */
  onChange?: (v: FilterValue) => void;
};

export default function JobFilters({ value, onChange }: Props) {
  // estado interno para fallback quando value/onChange não forem fornecidos
  const [local, setLocal] = useState<string>(value?.texto ?? "");

  // quando value externo mudar, sincroniza o interno
  useEffect(() => {
    if (value && value.texto !== local) setLocal(value.texto);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.texto]);

  const texto = value?.texto ?? local;

  const handleChange = (t: string) => {
    if (onChange) onChange({ texto: t });
    else setLocal(t);
  };

  return (
    <Form className="row row-cols-1 row-cols-lg-2 g-2 mb-3">
      <div className="col">
        <Form.Label>Filtro</Form.Label>
        <Form.Control
          type="text"
          placeholder="Pesquisar por título / cargo / local"
          value={texto}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
      <div className="col" />
    </Form>
  );
}
