import { RxFileText } from "react-icons/rx"
import { signOut } from "@/actions/user/user"
import { useNavigate } from "react-router-dom"
import { FaRegAddressCard } from "react-icons/fa6"
import { FiUser, FiLogOut, FiHome } from "react-icons/fi"
import { useNotificationContext } from "@/components/notifications/context"

import MenuButton from "./btn"

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
            <MenuButton title="Perfil" href="/usuario" icon={<FiUser />} />

            <MenuButton title="Meu Currículo" href="/usuario/curriculo" icon={<FaRegAddressCard />} />

            <MenuButton title="Minhas Candidaturas" href="/usuario/candidaturas" icon={<RxFileText />} />

            {/* Espaço flexível para empurrar os botões para baixo */}
            <div className="flex-grow-1" />

            {/* Botões no rodapé do menu */}
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
