'use client'

import short, { type SUUID } from "short-uuid"
import { useEffect, useRef, useState } from "react"

import type { City } from "@/types/all"
import type { Scholarity } from "@/_session/user/types"
import type { FieldMethods, Option } from "@/components/form-kit/types"

import { Button } from "react-bootstrap"
import { BsTrash } from "react-icons/bs"

import api from "@/actions/api"
import FormProvider from "@/components/form-kit/context"
import TextField from "@/components/form-kit/fields/text-field"
import SelectField from "@/components/form-kit/fields/select-field"
import NumberField from "@/components/form-kit/fields/number-field"

interface Props {
	info?: Scholarity
	curriculum_id?: string | number
	onSave: (info: Scholarity) => Promise<void>
	onDelete: (info?: Scholarity) => Promise<void>
	setNewFormVisible?: (val: boolean) => void
}

const optionSelecione: Option = { id: "", label: "Selecione" }

const monthOptions: Option[] = [
	optionSelecione,
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

const gradeOptions: Option[] = [
	optionSelecione,
	{ id: "fundamental", label: "Ensino Fundamental" },
	{ id: "medio", label: "Ensino Médio" },
	{ id: "tecnico", label: "Técnico" },
	{ id: "graduacao", label: "Graduação" },
	{ id: "pos", label: "Pós-Graduação" },
	{ id: "mestrado", label: "Mestrado" },
	{ id: "doutorado", label: "Doutorado" }
]

export default function ScholarityForm({
	info,
	curriculum_id,
	onSave,
	onDelete,
	setNewFormVisible
}: Props) {
	// id único do form
	const formId: string = useRef<SUUID>(short().generate()).current.toString()
	const [cities, setCities] = useState<City[] | null>(null)
	const [selectedUf, setSelectedUf] = useState<string>("")

	const selectCityRef = useRef<FieldMethods>(null)

	const ufOptions: Option[] = cities ? [
		{ id: "", label: "Selecione um estado" },
		...Array.from(new Set(cities.map(c => c.uf))).map((uf) => {
			return { id: uf, label: uf }
		})
	] : []

	const cityOptions: Option[] = cities ? [
		{ id: "", label: "Selecione" },
		...Array.from(
			cities.filter((c) => { return c.uf === selectedUf })
		).map((c) => { return { id: c.id, label: c.nome } })
	] : []

	const fetchLocations = async () => {
		const { status, data } = await api.get("/cidade/lista")
		if (status == 200) setCities(data.cidades)
	}

	// ===== Ações
	const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
		e.preventDefault()
		// Se for um form "novo", o Delete vira "Cancelar"
		if (!info) {
			setNewFormVisible?.(false)
			return
		}
		await onDelete()
	}

	const handleSubmit = async (formData: Record<string, any>) => {
		const payload: Record<string, any> = {
			curriculum_escolaridade_id: info?.curriculum_escolaridade_id,
			curriculum_curriculum_id: curriculum_id,
			inicioMes: Number(formData.inicio_mes || 0),
			inicioAno: Number(formData.inicio_ano || 0),
			fimMes: Number(formData.fim_mes || 0),
			fimAno: Number(formData.fim_ano || 0),
			descricao: String(formData.descricao || ""),
			instituicao: String(formData.instituicao || ""),
			cidade_id: Number(formData.cidade_id || 0),
			grau: String(formData.grau || "")
		}

		console.log(payload)
		onSave(payload as Scholarity)
		if (!info) setNewFormVisible?.(false)
	}

	useEffect(() => {
		if (cities) {
			setSelectedUf(cities.find((c) => c.id === info?.cidade_id)?.uf || "")
		}
	}, [cities])

	useEffect(() => {
		selectCityRef.current?.setValue?.(info?.cidade_id)
	}, [selectedUf])

	useEffect(() => {
		fetchLocations()
	}, [])

	return (
		<FormProvider
			id={formId}
			onSubmit={handleSubmit}
			className="border rounded-2 mt-3 p-4 shadow-sm bg-body"
		>
			<h3 className="fs-5 fw-bold mb-4">Formação</h3>

			<div className="row row-cols-lg-2 g-3">
				<SelectField
					id={`grau-${formId}`}
					name="grau"
					label="Grau escolar *"
					options={gradeOptions}
					initialValue={info?.grau || ""}
					required
				/>

				<TextField
					id={`desc-${formId}`}
					name="descricao"
					label="Curso / Descrição *"
					placeholder="Ex: Análise e Desenvolvimento de Sistemas"
					{...info?.descricao ? { initialValue: info.descricao } : {}}
					required
				/>
			</div>

			<div className="row row-cols-lg-2 g-3">
				<TextField
					id={`instituicao-${formId}`}
					name="instituicao"
					label="Instituição *"
					placeholder="Ex: Faculdade Santa Marcelina"
					{...info?.instituicao ? { initialValue: info.instituicao } : {}}
					required
				/>

				{/* UF controla a lista de cidades */}
				<SelectField
					id={`uf-${formId}`}
					name="uf"
					label="UF *"
					options={ufOptions}
					initialValue={selectedUf || ""}
					required
					onChange={(val) => {
						setSelectedUf(val)
					}}
				/>
			</div>

			<div className="row row-cols-lg-2 g-3">
				<SelectField
					ref={selectCityRef}
					id={`cidade-${formId}`}
					name="cidade_id"
					label="Cidade *"
					options={cityOptions}
					required
				/>
			</div>

			<div className="row row-cols-lg-4 g-3">
				<SelectField
					id={`inicio-mes-${formId}`}
					name="inicio_mes"
					label="Mês de início *"
					options={monthOptions}
					initialValue={info?.inicioMes || ""}
					required
				/>

				<NumberField
					id={`inicio-ano-${formId}`}
					name="inicio_ano"
					label="Ano de início *"
					placeholder="Ex: 2022"
					{...info?.inicioAno ? { initialValue: info.inicioAno } : {}}
					maxLenght={4}
					required
				/>

				<SelectField
					id={`fim-mes-${formId}`}
					name="fim_mes"
					label="Mês de fim *"
					options={monthOptions}
					initialValue={info?.fimMes || ""}
					required
				/>

				<NumberField
					id={`fim-ano-${formId}`}
					name="fim_ano"
					label="Ano de fim *"
					placeholder="Ex: 2025"
					{...info?.fimAno ? { initialValue: info.fimAno } : {}}
					maxLenght={4}
					required
				/>
			</div>

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
