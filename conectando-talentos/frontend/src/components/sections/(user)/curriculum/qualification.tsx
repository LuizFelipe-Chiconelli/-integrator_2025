import { useEffect, useState } from "react"
import { Button, Container, Spinner, Alert } from "react-bootstrap"
import api from "@/services/api"

import type { Qualification } from "@/types/user"
import QualificationForm from "@/components/user/curriculum/forms/qualification"

// === Tipos esperados da API (ajuste se necessário)
interface QualAPI {
  curriculum_qualificacao_id: number
  curriculum_id: number
  mes: number
  ano: number
  cargaHoraria: number
  descricao: string
  estabelecimento: string
}

// API -> Front
const apiToFront = (r: QualAPI): Qualification => ({
  id: r.curriculum_qualificacao_id,
  mes: String(r.mes ?? ""),
  ano: String(r.ano ?? ""),
  carga_horaria: String(r.cargaHoraria ?? ""),
  descricao: r.descricao ?? "",
  estabelecimento: r.estabelecimento ?? ""
})

// Form -> API
const formToApi = (curriculumId: number, f: Record<string, any>) => ({
  curriculum_id: curriculumId,
  mes: Number(f.mes || 0),
  ano: Number(f.ano || 0),
  cargaHoraria: Number(f.carga_horaria || 0),
  descricao: (f.descricao ?? "").toString().trim(),
  estabelecimento: (f.estabelecimento ?? "").toString().trim()
})

export default function QualificationSection() {
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [newFormVisible, setNewFormVisible] = useState<boolean>(false)

  const [curriculumId, setCurriculumId] = useState<number | null>(null)
  const [items, setItems] = useState<Qualification[]>([])
  const [erroPerfil, setErroPerfil] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        // 1) buscar curriculumId no perfil
        const respPerfil = await api.get("/usuario/perfil")
        const cur = respPerfil.data?.curriculum
        const curId: number | null = Number(cur?.curriculum_id ?? cur?.id ?? 0) || null
        if (!curId) {
          setErroPerfil("Finalize seu perfil (currículo) para liberar Cursos/Qualificações.")
          setLoading(false)
          return
        }
        setCurriculumId(curId)

        // 2) listar qualificações
        await refreshList(curId)
      } catch (e) {
        console.error(e)
        setErroPerfil("Erro ao carregar dados iniciais.")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const refreshList = async (curId?: number) => {
    const id = curId ?? curriculumId
    if (!id) return
    setBusy(true)
    try {
      const resp = await api.get<{ status: number; data: QualAPI[] }>(`/qualificacao/lista/${id}`)
      setItems((resp.data?.data ?? []).map(apiToFront))
    } catch (e) {
      console.error(e)
      alert("Erro ao carregar cursos/qualificações.")
    } finally {
      setBusy(false)
    }
  }

  const handleSave = async (form: Record<string, any>, id?: number) => {
    if (!curriculumId) return alert("Finalize o perfil primeiro.")
    const payload = formToApi(curriculumId, form)
    try {
      if (id) {
        await api.put(`/qualificacao/atualizar/${id}`, payload)
      } else {
        await api.post(`/qualificacao/criar`, payload)
      }
      await refreshList()
      setNewFormVisible(false)
    } catch (e) {
      console.error(e)
      alert("Erro ao salvar qualificação.")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir esta qualificação?")) return
    try {
      await api.delete(`/qualificacao/excluir/${id}`)
      await refreshList()
    } catch (e) {
      console.error(e)
      alert("Erro ao excluir qualificação.")
    }
  }

  return (
    <Container className="bg-white border rounded-3 p-4 shadow-sm">
      <div className="d-flex align-items-center gap-2 mb-2">
        <h2 className="fs-3 fw-bold m-0">Cursos / Qualificações</h2>
        {(loading || busy) && <Spinner size="sm" animation="border" />}
      </div>

      {erroPerfil && <Alert variant="warning">{erroPerfil}</Alert>}

      {!loading && !erroPerfil && items.map((info) => (
        <QualificationForm
          key={info.id}
          info={info}
          onSave={(data) => handleSave(data, info.id)}
          onDelete={() => handleDelete(info.id)}
        />
      ))}

      {!loading && !erroPerfil && newFormVisible && (
        <QualificationForm
          onSave={(data) => handleSave(data)}
          onDelete={() => setNewFormVisible(false)}
          setNewFormVisible={setNewFormVisible}
        />
      )}

      {!loading && !erroPerfil && (
        <div className="d-flex justify-content-end mt-3">
          <Button onClick={() => setNewFormVisible(true)}>+ Adicionar curso/qualificação</Button>
        </div>
      )}
    </Container>
  )
}
