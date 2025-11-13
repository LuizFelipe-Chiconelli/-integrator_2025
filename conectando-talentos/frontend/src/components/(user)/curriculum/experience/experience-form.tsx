'use client'

import { useState, useRef } from "react"
import short, { type SUUID } from "short-uuid"
import type { Experience } from "@/_session/user/types"
import type { FieldMethods, Option } from "@/components/form-kit/types"

import { BsTrash } from "react-icons/bs"
import { Button, FormCheck } from "react-bootstrap"

import FormProvider from "@/components/form-kit/context"
import TextArea from "@/components/form-kit/fields/text-area"
import TextField from "@/components/form-kit/fields/text-field"
import SelectField from "@/components/form-kit/fields/select-field"
import NumberField from "@/components/form-kit/fields/number-field"

interface Props {
	info?: Experience
	curriculum_id?: string | number
	roleOptions: Option[]
	onSave: (info: Experience) => Promise<void>
	onDelete: (info?: Experience) => Promise<void>
	setNewFormVisible?: (val: boolean) => void
}

const monthOptions: Option[] = [
	{ id: "", label: "Selecione" },
	{ id: "1", label: "01" },
	{ id: "2", label: "02" },
	{ id: "3", label: "03" },
	{ id: "4", label: "04" },
	{ id: "5", label: "05" },
	{ id: "6", label: "06" },
	{ id: "7", label: "07" },
	{ id: "8", label: "08" },
	{ id: "9", label: "09" },
	{ id: "10", label: "10" },
	{ id: "11", label: "11" },
	{ id: "12", label: "12" }
]

export default function ExperienceForm({
	info,
	onSave,
	onDelete,
	roleOptions,
	curriculum_id,
	setNewFormVisible
}: Props) {
	// id único do form
	const formId: string = useRef<SUUID>(short().generate()).current.toString()

	const fimMesRef = useRef<FieldMethods>(null)
	const fimAnoRef = useRef<FieldMethods>(null)

	// Emprego atual => TRUE quando NÃO há fim_ano (ou quando marcamos manualmente)
	const [currentWorking, setCurrentWorking] = useState<boolean>(() => !info?.fimAno)

	const onChangeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
		const checked = e.target.checked
		setCurrentWorking(checked)
		if (checked) {
			fimMesRef.current?.setValue?.("")
			fimAnoRef.current?.setValue?.("")
		}
	}

	// ===== Ações
	const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
		e.preventDefault()
		// Se for um form "novo", o Delete vira "Cancelar"
		if (!info) {
			setNewFormVisible?.(false)
			return
		}

		await onDelete(info)
	}

	const onSubmit = async (formData: Record<string, any>): Promise<void> => {
		const payload: Record<string, any> = {
			curriculum_id: curriculum_id,
			curriculum_experiencia_id: info?.curriculum_experiencia_id,
			inicioMes: Number(formData.inicio_mes || 0),
			inicioAno: Number(formData.inicio_ano || 0),
			fimMes: Number(formData.fim_mes) || null,
			fimAno: Number(formData.fim_ano) || null,
			estabelecimento: formData.estabelecimento,
			cargo_id: formData.cargo_id,
			cargoDescricao: formData.cargo_descricao,
			atividadesExercidas: formData.atividades_exercidas
		}

		await onSave(payload as Experience)

		if (!info) setNewFormVisible?.(false)
	}

	return (
		<FormProvider
			id={formId}
			onSubmit={onSubmit}
			className="border rounded-2 mt-3 p-4 shadow-sm bg-body"
		>
			<h3 className="fs-5 fw-bold mb-4">Experiência</h3>

			<div className="row row-cols-lg-2 g-3">
				<TextField
					id={`estabelecimento-${formId}`}
					name="estabelecimento"
					label="Empresa / Estabelecimento *"
					placeholder="Ex: Tech Company"
					initialValue={info?.estabelecimento || ""}
					required
				/>

				{/* catálogo de cargos (opcional) */}
				<SelectField
					id={`cargo-id-${formId}`}
					name="cargo_id"
					label="Cargo (catálogo)"
					options={roleOptions}
					initialValue={String(info?.cargo_id || "")}
					required
				/>
			</div>

			<div className="row row-cols-lg-2 g-3">
				{/* descrição livre do cargo (alternativa ao catálogo) */}
				<TextField
					id={`cargo-desc-${formId}`}
					name="cargo_descricao"
					label="Cargo (descrição livre)"
					placeholder="Ex: Desenvolvedor de Sistemas"
					initialValue={info?.cargoDescricao || ""}
				/>
			</div>

			<div className="row g-3">
				<TextArea
					id={`atividades-${formId}`}
					name="atividades_exercidas"
					label="Atividades exercidas"
					placeholder="Fale um pouco sobre o que fazia na empresa"
					initialValue={info?.atividadesExercidas || ""}
				/>
			</div>

			<div className="row row-cols-lg-4 g-3">
				<SelectField
					id={`inicio-mes-${formId}`}
					name="inicio_mes"
					label="Mês de início *"
					options={monthOptions}
					initialValue={String(info?.inicioMes || "")}
					required
				/>

				<NumberField
					id={`inicio-ano-${formId}`}
					name="inicio_ano"
					label="Ano de início *"
					placeholder="Ex: 2022"
					initialValue={String(info?.inicioAno || "")}
					maxLenght={4}
					required
				/>

				{!currentWorking && (
					<>
						<SelectField
							ref={fimMesRef}
							id={`fim-mes-${formId}`}
							name="fim_mes"
							label="Mês de fim *"
							options={monthOptions}
							initialValue={String(info?.fimMes || "")}
							required
						/>

						<NumberField
							ref={fimAnoRef}
							id={`fim-ano-${formId}`}
							name="fim_ano"
							label="Ano de fim *"
							placeholder="Ex: 2025"
							initialValue={String(info?.fimAno || "")}
							maxLenght={4}
							required
						/>
					</>
				)}
			</div>

			<FormCheck
				label="Emprego atual"
				checked={currentWorking}
				onChange={onChangeCheckbox}
			/>

			<div className="d-flex justify-content-end gap-2 mt-3">
				<Button variant={info ? "danger" : "secondary"} onClick={handleDelete}>
					<BsTrash /> {info ? "Excluir" : "Cancelar"}
				</Button>
				<Button type="submit" variant="success">
					Salvar
				</Button>
			</div>
		</FormProvider>
	)
}
