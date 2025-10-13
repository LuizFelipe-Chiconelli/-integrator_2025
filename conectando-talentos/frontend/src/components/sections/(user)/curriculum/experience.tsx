import { useEffect, useState } from "react"
import { Button, Container, Spinner, Alert } from "react-bootstrap"
import { useSessionContext } from "@/components/user/session/context"

import type { Role } from "@/types/all"
import type { Experience } from "@/types/user"
import type { Option } from "@/components/form-kit/types"

import api from "@/services/api"

import ExperienceForm from "@/components/user/curriculum/forms/experience"

export default function ExperienceSection() {
	const [experience, setExperience] = useState<Experience[] | null>([])
	const [newFormVisible, setNewFormVisible] = useState<boolean>(false)
	const [roleOptions, setRoleOptions] = useState<Option[]>([])

	const { userInfo, fetchExperience, saveExperience, deleteExperience } = useSessionContext()

	const refreshExperience = async (userId: string | number): Promise<void> => {
		const res: Experience[] = await fetchExperience(userId)
		setExperience(res)
	}

	const handleDelete = async (info?: Experience): Promise<void> => {
		if (info?.curriculum_experiencia_id) {
			await deleteExperience(info.curriculum_experiencia_id)
		}

		await refreshExperience(userInfo!.curriculum.curriculum_id)
	}

	const fetchRoles = async (): Promise<void> => {
		const res = await api.get<{ status: number; cargos: Role[] }>("/experiencia/cargos")
		const opt: Option[] = [
			{ id: "", label: "Selecione" },
			...res.data.cargos.map(c => ({ id: c.cargo_id, label: c.descricao }))
		]
		setRoleOptions(opt)
	}

	useEffect(() => {
		if (userInfo) {
			refreshExperience(userInfo.curriculum.curriculum_id)
		}
	}, [userInfo])

	useEffect(() => {
		fetchRoles()
	}, [])

	return (
		<Container className="bg-white border rounded-3 p-4 shadow-sm">
			<div className="d-flex align-items-center gap-2 mb-2">
				<h2 className="fs-3 fw-bold m-0">Experiência</h2>
				{!userInfo && <Spinner size="sm" animation="border" />}
			</div>

			{!userInfo?.curriculum && (
				<Alert variant="warning" className="mb-3">
					Complete o registro para continuar
				</Alert>
			)}

			{userInfo && experience && (experience.map((info) => (
				<ExperienceForm
					key={info.curriculum_experiencia_id}
					info={info}
					onSave={saveExperience}
					onDelete={() => handleDelete(info)}
					curriculum_id={userInfo.curriculum.curriculum_id}
					roleOptions={roleOptions}
				/>
			)))}

			{userInfo && newFormVisible && (
				<ExperienceForm
					onSave={saveExperience}
					curriculum_id={userInfo.curriculum.curriculum_id}
					onDelete={() => handleDelete()}
					setNewFormVisible={setNewFormVisible}
					roleOptions={roleOptions}
				/>
			)}

			{userInfo && (
				<div className="d-flex justify-content-end mt-3">
					<Button onClick={() => setNewFormVisible(true)}>+ Adicionar formação</Button>
				</div>
			)}
		</Container>
	)
}
