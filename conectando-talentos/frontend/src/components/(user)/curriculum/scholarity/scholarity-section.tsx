import type { Scholarity } from "@/_session/user/types"

import { useEffect, useState } from "react"
import { useUserSessionContext } from "@/_session/user/context"
import { Button, Container, Spinner, Alert } from "react-bootstrap"

import ScholarityForm from "./scholarity-form"

export default function ScholaritySection() {
	const [scholarity, setScholarity] = useState<Scholarity[] | null>([])
	const [newFormVisible, setNewFormVisible] = useState<boolean>(false)

	const { userInfo, fetchScholarity, saveScholarity, deleteScholarity } = useUserSessionContext()

	const refreshScholarity = async (userId: string | number): Promise<void> => {
		const res: Scholarity[] = await fetchScholarity(userId)
		setScholarity(res)
	}

	const handleSave = async (info: Scholarity): Promise<void> => {
		await saveScholarity(info)
		await refreshScholarity(userInfo!.curriculum.curriculum_id)
	}

	const handleDelete = async (info?: Scholarity): Promise<void> => {
		if (info?.curriculum_escolaridade_id) {
			await deleteScholarity(info.curriculum_escolaridade_id)
		}

		await refreshScholarity(userInfo!.curriculum.curriculum_id)
	}

	useEffect(() => {
		if (userInfo) {
			refreshScholarity(userInfo.curriculum.curriculum_id)
		}
	}, [userInfo])

	return (
		<Container className="bg-white border rounded-3 p-4 shadow-sm">
			<div className="d-flex align-items-center gap-2 mb-2">
				<h2 className="fs-3 fw-bold m-0">Escolaridade</h2>
				{!userInfo && <Spinner size="sm" animation="border" />}
			</div>

			{!userInfo?.curriculum && (
				<Alert variant="warning" className="mb-3">
					Complete o registro para continuar
				</Alert>
			)}

			{userInfo && scholarity && (scholarity.map((info) => (
				<ScholarityForm
					key={info.curriculum_escolaridade_id}
					info={info}
					onSave={handleSave}
					onDelete={() => handleDelete(info)}
					curriculum_id={userInfo.curriculum.curriculum_id}
				/>
			)))}

			{userInfo && newFormVisible && (
				<ScholarityForm
					onSave={handleSave}
					curriculum_id={userInfo.curriculum.curriculum_id}
					onDelete={() => handleDelete()}
					setNewFormVisible={setNewFormVisible}
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
