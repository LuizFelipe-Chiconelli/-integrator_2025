import { useEffect, useState } from "react"
import { Button, Container, Spinner } from "react-bootstrap"

import type { Qualification } from "@/types/user"

import QualificationForm from "@/components/user/curriculum/forms/qualification"

export default function QualificationSection() {
	const [loadingHead, setLoadingHead] = useState(false)
	const [newFormVisible, setNewFormVisible] = useState<boolean>(false)

	const refreshList = async (): Promise<void> => {
		setLoadingHead(true)
		// chamar api
		setLoadingHead(false)
	}

	const scholarity: Qualification[] = [
		{ id: 1, mes: "8", ano: "2020", carga_horaria: "120", descricao: "Descrição do curso", estabelecimento: "Faculdade Santa Marcelina" }
	]

	useEffect(() => {
		refreshList()
	}, [])

	return (
		<Container className="bg-white border rounded-3 p-4 shadow-sm">
			<div className="d-flex align-items-center gap-2 mb-2">
				<h2 className="fs-3 fw-bold m-0">Cursos / Qualificações</h2>
				{loadingHead && <Spinner size="sm" animation="border" />}
			</div>

			{scholarity.map((info, index) => {
				return (<QualificationForm key={index} info={info} refreshList={refreshList} />)
			})}

			{newFormVisible && (
				<QualificationForm refreshList={refreshList} setNewFormVisible={setNewFormVisible} />
			)}

			<div className="d-flex justify-content-end mt-3">
				<Button onClick={() => { setNewFormVisible(true) }}>+ Adicionar formação</Button>
			</div>
		</Container>
	)
}
