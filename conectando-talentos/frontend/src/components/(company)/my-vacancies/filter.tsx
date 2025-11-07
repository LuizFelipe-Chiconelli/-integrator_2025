"use client"

import { Form } from "react-bootstrap"

type Props = {
	value: { texto: string, status: "" | "11" | "12" | "13" | "14" }
	onChange: (v: { texto: string, status: "" | "11" | "12" | "13" | "14" }) => void
}

export default function VacancyFilters({ value, onChange }: Props) {
	return (
		<Form className="row row-cols-1 row-cols-lg-2 g-2 mb-3">
			<div className="col">
				<Form.Label>Filtro</Form.Label>
				<Form.Control
					type="text"
					placeholder="Pesquisar por título / cargo / local"
					value={value.texto}
					onChange={(e) => onChange({ ...value, texto: e.target.value })}
				/>
			</div>

			<div className="col">
				<Form.Label>Status</Form.Label>
				<Form.Select
					value={value.status}
					onChange={(e) =>
						onChange({ ...value, status: e.target.value as Props["value"]["status"] })
					}
				>
					<option value="">Todos</option>
					<option value="11">Em aberto</option>
					<option value="12">Pausada</option>
					<option value="13">Encerrada</option>
					<option value="14">Cancelada</option>
				</Form.Select>
			</div>
		</Form>
	)
}