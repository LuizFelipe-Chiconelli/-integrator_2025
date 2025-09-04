import { useEffect, useState } from "react"
import { Button, Container, Spinner } from "react-bootstrap"

import type { Experience } from "@/types/user"

// import api from "@/services/api"
import ExperienceForm from "@/components/user/curriculum/forms/experience"

export default function ExperienceSection() {
	const [loadingHead, setLoadingHead] = useState(false);
	const [newFormVisible, setNewFormVisible] = useState<boolean>(false)

	const refreshList = async (): Promise<void> => {
		setLoadingHead(true)
		// chamar api
		setLoadingHead(false)
	}

	const experience: Experience[] = [
		{ id: 1, estabelecimento: "Fasm Tech", cargo_descricao: "Desenvolvedor de Sistemas", atividades_exercidas: "Teste", inicio_mes: "2", inicio_ano: "2020", fim_mes: "8", fim_ano: "2024" }
	]

	useEffect(() => {
		refreshList()
	}, [])

	return (
		<Container className="bg-white border rounded-3 p-4 shadow-sm">
			<div className="d-flex align-items-center gap-2 mb-2">
				<h2 className="fs-3 fw-bold m-0">Experiência Profissional</h2>
				{loadingHead && <Spinner size="sm" animation="border" />}
			</div>

			{experience.map((info, index) => {
				return (<ExperienceForm key={index} info={info} refreshList={refreshList} />)
			})}

			{newFormVisible && (
				<ExperienceForm refreshList={refreshList} setNewFormVisible={setNewFormVisible} />
			)}

			<div className="d-flex justify-content-end mt-3">
				<Button onClick={() => { setNewFormVisible(true) }}>+ Adicionar experiência</Button>
			</div>
		</Container>
	);
}
