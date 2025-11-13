import MenuButton from "./btn"

import { RxFileText } from "react-icons/rx"
import { useNavigate } from "react-router-dom"
import { LuTableProperties } from "react-icons/lu"
import { signOut } from "@/actions/company/company"
import { FiBriefcase, FiHome, FiLogOut, FiUser } from "react-icons/fi"
import { useNotificationContext } from "@/components/notifications/context"

export default function Menu() {
    const navigate = useNavigate()

    const { sendNotification } = useNotificationContext()

    const handleLogout = async () => {
        const res: { ok: boolean } = await signOut()

        if (res.ok) {
            sendNotification({ message: "Deslogado com sucesso!", type: "Success" })
            navigate("/")
            return
        }

        return sendNotification({ message: "Erro ao deslogar!", type: "Error" })
    }

    return (
        <div className="d-flex flex-column mt-4 flex-grow-1">
            <MenuButton
                title="Perfil"
                href="/minha-empresa"
                icon={<FiUser />}
            />
            <MenuButton
                title="Publicar Vaga"
                href="/minha-empresa/publicar-vaga"
                icon={<FiBriefcase />}
            />
            <MenuButton
                title="Candidaturas"
                href="/minha-empresa/candidaturas"
                icon={<RxFileText />}
            />
            <MenuButton
                title="Vagas da Empresa"
                href="/minha-empresa/vagas"
                icon={<LuTableProperties />}
            />

            <div className="flex-grow-1" />

            <MenuButton
                title="Página Inicial"
                href="/"
                icon={<FiHome />}
            />

            <button
                onClick={handleLogout}
                className="btn btn-outline-danger d-flex align-items-center gap-2 mt-2"
            >
                <FiLogOut /> Encerrar Sessão
            </button>
        </div>
    )
}