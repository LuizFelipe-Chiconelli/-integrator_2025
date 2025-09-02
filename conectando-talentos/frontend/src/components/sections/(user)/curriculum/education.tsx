import { useState } from "react"
import { Button, Container, Spinner } from "react-bootstrap"

import EducationForm from "@/components/user/curriculum/forms/education"
import type { Scholarity } from "@/types/user"

export default function EducationSection() {
	// const [loadingHead, setLoadingHead] = useState(true)
	const [newFormVisible, setNewFormVisible] = useState<boolean>(false)

	const refreshList = async (): Promise<void> => {
		// chamar api
	}

	const scholarity: Scholarity[] = [
		{ id: 1, grau: "EM", cidade_id: 1, descricao: "Teste", inicio_mes: "08", inicio_ano: "2020", fim_mes: "09", fim_ano: "2024", instituicao: "Faculdade Santa Marcelina" }
	]

	return (
		<Container className="bg-white border rounded-3 p-4 shadow-sm">
			<div className="d-flex align-items-center gap-2 mb-2">
				<h2 className="fs-3 fw-bold m-0">Escolaridade</h2>
				{/* {loadingHead && <Spinner size="sm" animation="border" />} */}
			</div>

			{scholarity.map((info) => {
				return (<EducationForm info={info} refreshList={refreshList} />)
			})}

			{newFormVisible && (
				<EducationForm refreshList={refreshList} setNewFormVisible={setNewFormVisible} />
			)}

			<div className="d-flex justify-content-end mt-3">
				<Button onClick={() => { setNewFormVisible(true) }}>+ Adicionar formação</Button>
			</div>
		</Container>
	)
}
