"use server"

import api from "../api"
import axios from "axios"

export async function signIn(email: string, password: string): Promise<{
    ok: boolean, message: string, company?: { id: number, nome: string, email: string }
}> {
    try {
        const res: {
            data: {
                mensagem: string
                empresa: {
                    id: number
                    nome: string
                    email: string
                }
            }
        } = await api.post("/empresa/login", { email, senha: password })

        return { ok: true, message: "Logado com sucesso!", company: res.data.empresa }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { ok: false, message: error.response?.data.mensagem }
        }

        return { ok: false, message: "Erro ao logar. Tente novamente mais tarde!" }
    }
}

export async function signUp(
    payload: Record<string, string | boolean>
): Promise<{
    ok: boolean, message: string
}> {
    try {
        const res: {
            data: {
                mensagem: string,
                status: number
            }
        } = await api.post("/empresa/cadastrar", {
            nome: payload.name,
            cnpj: payload.cnpj,
            endereco: payload.address,
            descricao: payload.description,
            email: payload.email,
            senha: payload.password
        })

        return { ok: true, message: res.data.mensagem }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { ok: false, message: error.response?.data.mensagem }
        }

        return { ok: false, message: "Erro ao cadastrar. Tente novamente mais tarde!" }
    }
}

export async function signOut(): Promise<{ ok: boolean }> {
    try {
        await api.post("/usuario/logout", {}, { withCredentials: true })
        return { ok: true }
    } catch (err) {
        return { ok: false }
    }
}
