import { useEffect, useState } from "react"
import { useUserSessionContext } from "@/_session/user/context"
import { Button, Container, Spinner, Alert } from "react-bootstrap"

import type { Qualification } from "@/_session/user/types"

import QualificationForm from "./qualification-form"

export default function QualificationSection() {
	const [qualification, setQualification] = useState<Qualification[] | null>([])
	const [newFormVisible, setNewFormVisible] = useState<boolean>(false)

	const { userInfo, fetchQualification, saveQualification, deleteQualification } = useUserSessionContext()

	const refreshQualification = async (userId: string | number): Promise<void> => {
		const res: Qualification[] = await fetchQualification(userId)
		setQualification(res)
	}

	const handleSave = async (info: Qualification): Promise<void> => {
		try {
			await saveQualification(info)

			if (userInfo) {
				await refreshQualification(userInfo.curriculum.curriculum_id)
			}
		} catch (error) {
			console.log(error)
		}
	}

	const handleDelete = async (info?: Qualification): Promise<void> => {
		if (info?.curriculum_qualificacao_id) {
			await deleteQualification(info.curriculum_qualificacao_id)
		}

		await refreshQualification(userInfo!.curriculum.curriculum_id)
	}

	useEffect(() => {
		if (userInfo) {
			refreshQualification(userInfo.curriculum.curriculum_id)
		}
	}, [userInfo])

	return (
		<Container className="bg-white border rounded-3 p-4 shadow-sm">
			<div className="d-flex align-items-center gap-2 mb-2">
				<h2 className="fs-3 fw-bold m-0">Qualificação</h2>
				{!userInfo && <Spinner size="sm" animation="border" />}
			</div>

			{!userInfo?.curriculum && (
				<Alert variant="warning" className="mb-3">
					Complete o registro para continuar
				</Alert>
			)}

			{userInfo && qualification && (qualification.map((info) => (
				<QualificationForm
					key={info.curriculum_qualificacao_id}
					info={info}
					onSave={handleSave}
					onDelete={() => handleDelete(info)}
					curriculum_id={userInfo.curriculum.curriculum_id}
				/>
			)))}

			{userInfo && newFormVisible && (
				<QualificationForm
					onSave={handleSave}
					onDelete={() => handleDelete()}
					curriculum_id={userInfo.curriculum.curriculum_id}
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
