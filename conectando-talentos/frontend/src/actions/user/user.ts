"use server"

import api from "../api"
import axios from "axios"

import type { User } from "@/_session/user/types"

export async function signIn(email: string, password: string): Promise<{
    ok: boolean, message: string, user?: { id: number, tipo: string, email: string }
}> {
    try {
        const res: {
            data: {
                mensagem: string
                usuario: {
                    id: number
                    tipo: string
                    email: string
                }
            }
        } = await api.post("/usuario/login", { email, senha: password })

        return { ok: true, message: "Logado com sucesso!", user: res.data.usuario }
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
        } = await api.post("/usuario/cadastrar", {
            nome: payload.name,
            email: payload.email,
            senha: payload.password,
            aceite: payload.accept,
            tipo: "CA"
        })

        return { ok: true, message: res.data.mensagem }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { ok: false, message: error.response?.data.mensagem }
        }

        return { ok: false, message: "Erro ao logar. Tente novamente mais tarde!" }
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

export async function isSignedIn(): Promise<boolean> {
    try {
        const { data }: { data: User } = await api.get("/usuario/perfil")

        if (!data) {
            throw new Error('Não autenticado')
        }

        return true
    } catch (error) {
        return false
    }
}

export async function apply(id: number): Promise<{ ok: boolean, message?: string }> {
    try {
        await api.post("/candidatura/aplicar", { vaga_id: id });

        return { ok: true }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { ok: false, message: error.response?.data.mensagem }
        }

        return { ok: false, message: String(error) }
    }
}
