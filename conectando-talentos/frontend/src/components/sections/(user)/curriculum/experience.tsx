import { useEffect, useMemo, useState } from "react"
import { Button, Container, Spinner, Alert } from "react-bootstrap"
import api from "@/services/api"

import type { Experience } from "@/types/user"
import ExperienceForm from "@/components/user/curriculum/forms/experience"

// ===== Tipos vindos da API
interface CargoAPI {
  cargo_id: number
  descricao: string
}
interface ExpAPI {
  curriculum_experiencia_id: number
  curriculum_id: number
  inicioMes: number
  inicioAno: number
  fimMes: number | null
  fimAno: number | null
  estabelecimento: string | null
  cargo_id: number | null
  cargoDescricao: string | null
  atividadesExercidas: string | null
}

// ===== Mapeamentos
const apiToFront = (r: ExpAPI): Experience => ({
  id: r.curriculum_experiencia_id,
  inicio_mes: String(r.inicioMes ?? ""),
  inicio_ano: String(r.inicioAno ?? ""),
  fim_mes: r.fimMes === null ? "" : String(r.fimMes),
  fim_ano: r.fimAno === null ? "" : String(r.fimAno),
  estabelecimento: r.estabelecimento ?? "",
  cargo_descricao: r.cargoDescricao ?? "",      // exibimos a descrição livre (se houver)
  atividades_exercidas: r.atividadesExercidas ?? "",
  cargo_id: r.cargo_id ? String(r.cargo_id) : ""
})

const formToApi = (curriculumId: number, form: Record<string, any>) => {
  const empregoAtual = !!form.empregoAtual
  const fimMes = empregoAtual ? null : (form.fim_mes ? Number(form.fim_mes) : null)
  const fimAno = empregoAtual ? null : (form.fim_ano ? Number(form.fim_ano) : null)

  return {
    curriculum_id: curriculumId,
    inicioMes: Number(form.inicio_mes || 0),
    inicioAno: Number(form.inicio_ano || 0),
    fimMes,
    fimAno,
    estabelecimento: form.estabelecimento?.toString().trim() || null,
    cargo_id: form.cargo_id ? Number(form.cargo_id) : null,
    cargoDescricao: form.cargo_descricao?.toString().trim() || null,
    atividadesExercidas: form.atividades_exercidas?.toString().trim() || null,
    empregoAtual
  }
}

export default function ExperienceSection() {
  // ===== Estado
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [newFormVisible, setNewFormVisible] = useState(false)

  const [curriculumId, setCurriculumId] = useState<number | null>(null)
  const [items, setItems] = useState<Experience[]>([])
  const [cargos, setCargos] = useState<CargoAPI[]>([])
  const [erroPerfil, setErroPerfil] = useState<string | null>(null)

  const cargoOptions = useMemo(
    () => [{ id: "", label: "Selecione" }, ...cargos.map(c => ({ id: String(c.cargo_id), label: c.descricao }))],
    [cargos]
  )

  // ===== Cargas iniciais
  useEffect(() => {
    ;(async () => {
      try {
        // cidades/UF não são necessários aqui
        // 1) curriculumId
        const respPerfil = await api.get("/usuario/perfil")
        const cur = respPerfil.data?.curriculum
        const curId: number | null = Number(cur?.curriculum_id ?? cur?.id ?? 0) || null

        if (!curId) {
          setErroPerfil("Finalize seu perfil (currículo) para liberar a Experiência Profissional.")
          setLoading(false)
          return
        }
        setCurriculumId(curId)

        // 2) lista de cargos (pública)
        const respCargos = await api.get<{ status: number; cargos: CargoAPI[] }>("/experiencia/cargos")
        setCargos(respCargos.data?.cargos ?? [])

        // 3) lista de experiências
        await refreshList(curId)
      } catch (e) {
        console.error(e)
        setErroPerfil("Erro ao carregar dados iniciais.")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // ===== Lista
  const refreshList = async (curId?: number) => {
    const id = curId ?? curriculumId
    if (!id) return
    setBusy(true)
    try {
      const resp = await api.get<{ status: number; data: ExpAPI[] }>(`/experiencia/lista/${id}`)
      setItems((resp.data?.data ?? []).map(apiToFront))
    } catch (e) {
      console.error(e)
      alert("Erro ao carregar experiências.")
    } finally {
      setBusy(false)
    }
  }

  // ===== Create / Update / Delete
  const handleSave = async (form: Record<string, any>, id?: number) => {
    if (!curriculumId) {
      alert("Finalize o perfil primeiro.")
      return
    }
    const payload = formToApi(curriculumId, form)

    try {
      if (id) {
        await api.put(`/experiencia/atualizar/${id}`, payload)
      } else {
        await api.post(`/experiencia/criar`, payload)
      }
      await refreshList()
      setNewFormVisible(false)
    } catch (e) {
      console.error(e)
      alert("Erro ao salvar experiência.")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta experiência?")) return
    try {
      await api.delete(`/experiencia/excluir/${id}`)
      await refreshList()
    } catch (e) {
      console.error(e)
      alert("Erro ao excluir experiência.")
    }
  }

  // ===== Render
  return (
    <Container className="bg-white border rounded-3 p-4 shadow-sm">
      <div className="d-flex align-items-center gap-2 mb-2">
        <h2 className="fs-3 fw-bold m-0">Experiência Profissional</h2>
        {(loading || busy) && <Spinner size="sm" animation="border" />}
      </div>

      {erroPerfil && <Alert variant="warning">{erroPerfil}</Alert>}

      {!loading && !erroPerfil && items.map((info) => (
        <ExperienceForm
          key={info.id}
          info={info}
          cargoOptions={cargoOptions}
          onSave={(data) => handleSave(data, info.id)}
          onDelete={() => handleDelete(info.id)}
        />
      ))}

      {!loading && !erroPerfil && newFormVisible && (
        <ExperienceForm
          cargoOptions={cargoOptions}
          onSave={(data) => handleSave(data)}
          onDelete={() => setNewFormVisible(false)}
          setNewFormVisible={setNewFormVisible}
        />
      )}

      {!loading && !erroPerfil && (
        <div className="d-flex justify-content-end mt-3">
          <Button onClick={() => setNewFormVisible(true)}>+ Adicionar experiência</Button>
        </div>
      )}
    </Container>
  )
}
