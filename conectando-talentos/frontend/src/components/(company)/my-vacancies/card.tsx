"use client";

import type { Job } from "@/types/jobs"
import { Button, Card } from "react-bootstrap"
import { IoTimeOutline, IoLocationOutline } from "react-icons/io5"
import { LuBuilding, LuUser, LuDollarSign } from "react-icons/lu"

const statusLabel: Record<number, string> = {
	11: "Em aberto",
	12: "Pausada",
	13: "Encerrada",
	14: "Cancelada",
};

interface Props {
	info: Job
	openModal: (info: Job) => void
}

export default function VacancyCard({ info, openModal }: Props) {
	const minSalario: string = Number(info.salario_minimo).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
	const maxSalario: string = Number(info.salario_maximo).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

	const dateString: string = new Date(`${info.dtFim}T00:00:00`).toLocaleDateString("pt-BR", { timeZone: "UTC" })

	const handleOpenModal = (e: React.MouseEvent<HTMLButtonElement>): void => {
		e.preventDefault()
		openModal(info)
	}

	return (
		<Card className="w-full">
			<Card.Body className="d-flex justify-content-between">
				{/* esquerda */}
				<div className="d-flex flex-column">
					<div className="d-flex flex-column">
						<h3 className="fw-semibold mb-1" style={{ fontSize: 20 }}>
							{info.titulo || info.cargo_descricao || "Vaga"}
						</h3>

						<div className="d-flex align-items-center gap-2 flex-wrap">
							{info.cargo_descricao && (
								<span className="d-flex align-items-center gap-1">
									<LuBuilding style={{ fontSize: 16 }} />
									<span style={{ fontSize: 14 }}>{info.empresa_nome}</span>
								</span>
							)}
							<span className="badge bg-light text-dark ms-2" style={{ fontSize: 12 }}>
								{statusLabel[info.statusVaga] || "—"}
							</span>
						</div>
					</div>

					{info.requisitos && (
						<div className="text-6 mt-3" style={{ fontSize: 16 }}>
							<p className="mb-0">{info.requisitos}</p>
						</div>
					)}

					<div className="d-flex gap-3 mt-3 flex-wrap text-muted">
						{info.localizacao && (
							<div className="d-flex align-items-center gap-2">
								<IoLocationOutline /> {info.localizacao}
							</div>
						)}
						{(info.salario_minimo && info.salario_maximo) && (
							<div className="d-flex align-items-center gap-2">
								<LuDollarSign /> {minSalario} - {maxSalario}
							</div>
						)}
						{info.dtFim && (
							<div className="d-flex align-items-center gap-2">
								<IoTimeOutline /> até {dateString}
							</div>
						)}
						<div className="d-flex align-items-center gap-2">
							<LuUser /> —
						</div>
					</div>
				</div>

				{/* direita */}
				<div className="d-flex justify-content-end align-items-start">
					<Button style={{ fontSize: 15 }} onClick={handleOpenModal}>
						Gerenciar
					</Button>
				</div>
			</Card.Body>
		</Card>
	);
}