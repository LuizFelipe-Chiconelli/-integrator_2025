import { useEffect, useState } from "react"
import { Button, Container, Spinner, Alert } from "react-bootstrap"
import { useSessionContext } from "@/components/user/session/context"

import type { Scholarity } from "@/types/user"

import EducationForm from "@/components/user/curriculum/forms/education"

export default function EducationSection() {
	const [scholarity, setScholarity] = useState<Scholarity[] | null>([])
	const [newFormVisible, setNewFormVisible] = useState<boolean>(false)

	const { userInfo, fetchScholarity, saveScholarity, deleteScholarity } = useSessionContext()

	const refreshScholarity = async (userId: string | number): Promise<void> => {
		const res: Scholarity[] = await fetchScholarity(userId)
		setScholarity(res)
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

	// ===== Render
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
				<>
					{console.log(info)}
					<EducationForm
						key={info.curriculum_escolaridade_id}
						info={info}
						onSave={saveScholarity}
						onDelete={() => handleDelete(info)}
						curriculum_id={userInfo.curriculum.curriculum_id}
					/>
				</>
			)))}

			{userInfo && newFormVisible && (
				<EducationForm
					onSave={saveScholarity}
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
