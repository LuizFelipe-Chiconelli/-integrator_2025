import { useEffect, useMemo, useState } from "react"
import { Button, Container, Spinner, Alert } from "react-bootstrap"
import EducationForm from "@/components/user/curriculum/forms/education"
import api from "@/services/api"
import type { Scholarity } from "@/types/user"

// ---- Tipos auxiliares
interface CidadeAPI {
  id: number
  nome: string
  uf: string
}
interface EscolaridadeAPI {
  curriculum_escolaridade_id: number
  curriculum_curriculum_id: number
  grau: string                // slug: fundamental|medio|...
  descricao: string
  instituicao: string
  cidade_id: number
  inicioMes: number
  inicioAno: number
  fimMes: number
  fimAno: number
}

// opções padrão
const optSelecione = { id: "", label: "Selecione" }

// mapeia do formato da API → tipo usado no front
const apiToFront = (r: EscolaridadeAPI): Scholarity => ({
  id: r.curriculum_escolaridade_id,
  grau: r.grau || "",
  descricao: r.descricao || "",
  instituicao: r.instituicao || "",
  cidade_id: String(r.cidade_id ?? ""),
  inicio_mes: String(r.inicioMes ?? ""),
  inicio_ano: String(r.inicioAno ?? ""),
  fim_mes: String(r.fimMes ?? ""),
  fim_ano: String(r.fimAno ?? "")
})

// mapeia do form (front) → payload da API
const formToApi = (curriculumId: number, form: Record<string, any>) => ({
  curriculum_curriculum_id: curriculumId,
  inicioMes: Number(form.inicio_mes || 0),
  inicioAno: Number(form.inicio_ano || 0),
  fimMes: Number(form.fim_mes || 0),
  fimAno: Number(form.fim_ano || 0),
  descricao: String(form.descricao || ""),
  instituicao: String(form.instituicao || ""),
  cidade_id: Number(form.cidade_id || 0),
  // O controller aceita "grau" (slug) ou "escolaridade_id".
  grau: String(form.grau || "")
})

export default function EducationSection() {
  // ===== Estado
  const [loading, setLoading] = useState(true)
  const [savingHead, setSavingHead] = useState(false)
  const [newFormVisible, setNewFormVisible] = useState(false)

  const [curriculumId, setCurriculumId] = useState<number | null>(null)
  const [items, setItems] = useState<Scholarity[]>([])

  const [cidades, setCidades] = useState<CidadeAPI[]>([])
  const [erroPerfil, setErroPerfil] = useState<string | null>(null)

  // UFs únicas derivadas das cidades
  const ufOptions = useMemo(() => {
    const ufs = Array.from(new Set(cidades.map(c => c.uf))).sort()
    return [optSelecione, ...ufs.map(uf => ({ id: uf, label: uf }))]
  }, [cidades])

  // ===== Helpers
  const getUfByCidadeId = (cidadeIdStr?: string) => {
    const cid = Number(cidadeIdStr || 0)
    return cidades.find(c => c.id === cid)?.uf || ""
  }

  // ===== Cargas iniciais
  useEffect(() => {
    ;(async () => {
      try {
        // 1) Carregar cidades + UFs
        const respCidades = await api.get<{ status: number; cidades: CidadeAPI[] }>("/cidade/lista")
        setCidades(respCidades.data.cidades ?? [])

        // 2) Obter curriculumId a partir do perfil
        const respPerfil = await api.get("/usuario/perfil")
        const cur = respPerfil.data?.curriculum
        const curId: number | null =
          Number(cur?.curriculum_id ?? cur?.id ?? 0) || null

        if (!curId) {
          setErroPerfil("Perfis sem currículo: finalize seus dados pessoais para liberar a seção de Escolaridade.")
          setCurriculumId(null)
          setItems([])
          setLoading(false)
          return
        }

        setCurriculumId(curId)

        // 3) Carregar lista de escolaridade
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
    setSavingHead(true)
    try {
      const resp = await api.get<{ status: number; data: EscolaridadeAPI[] }>(`/escolaridade/lista/${id}`)
      const data = (resp.data?.data ?? []).map(apiToFront)
      setItems(data)
    } catch (e) {
      console.error(e)
      alert("Erro ao carregar escolaridade.")
    } finally {
      setSavingHead(false)
    }
  }

  // ===== Create / Update / Delete (callbacks usados pelo Form)
  const handleSave = async (formData: Record<string, any>, id?: number) => {
    if (!curriculumId) {
      alert("Finalize o seu perfil primeiro (sem currículo não é possível salvar escolaridade).")
      return
    }
    const payload = formToApi(curriculumId, formData)

    try {
      if (id) {
        await api.put(`/escolaridade/atualizar/${id}`, payload)
      } else {
        await api.post(`/escolaridade/criar`, payload)
      }
      await refreshList()
      setNewFormVisible(false)
    } catch (e) {
      console.error(e)
      alert("Erro ao salvar formação.")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta formação?")) return
    try {
      await api.delete(`/escolaridade/remover/${id}`)
      await refreshList()
    } catch (e) {
      console.error(e)
      alert("Erro ao excluir formação.")
    }
  }

  // ===== Render
  return (
    <Container className="bg-white border rounded-3 p-4 shadow-sm">
      <div className="d-flex align-items-center gap-2 mb-2">
        <h2 className="fs-3 fw-bold m-0">Escolaridade</h2>
        {(loading || savingHead) && <Spinner size="sm" animation="border" />}
      </div>

      {erroPerfil && (
        <Alert variant="warning" className="mb-3">
          {erroPerfil}
        </Alert>
      )}

      {!loading && !erroPerfil && items.map((info) => (
        <EducationForm
          key={info.id}
          info={info}
          ufOptions={ufOptions}
          cidades={cidades}
          onSave={(data) => handleSave(data, info.id)}
          onDelete={() => handleDelete(info.id)}
        />
      ))}

      {!loading && !erroPerfil && newFormVisible && (
        <EducationForm
          ufOptions={ufOptions}
          cidades={cidades}
          onSave={(data) => handleSave(data)}
          onDelete={() => setNewFormVisible(false)}
          setNewFormVisible={setNewFormVisible}
        />
      )}

      {!loading && !erroPerfil && (
        <div className="d-flex justify-content-end mt-3">
          <Button onClick={() => setNewFormVisible(true)}>+ Adicionar formação</Button>
        </div>
      )}
    </Container>
  )
}
