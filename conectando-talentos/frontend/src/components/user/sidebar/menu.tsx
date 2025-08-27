import MenuButton from "./btn"
import { RxFileText } from "react-icons/rx"
import { FaRegAddressCard } from "react-icons/fa6"
import { FiBriefcase, FiUser, FiLogOut, FiHome } from "react-icons/fi"
import api from "@/services/api"

export default function Menu() {
    const handleLogout = async () => {
        try {
            await api.post("/usuario/logout", {}, { withCredentials: true })
        } catch (err) {
            console.error("Falha ao deslogar:", err)
        } finally {
            window.location.href = "/" // vai para Home após logout
        }
    }

    return (
        <div className="d-flex flex-column mt-4 flex-grow-1">
            <MenuButton title="Perfil" href="/usuario" icon={<FiUser />} />

            <MenuButton title="Meu Currículo" href="/usuario/curriculo" icon={<FaRegAddressCard />} />

            <MenuButton title="Minhas Candidaturas" href="/usuario/candidaturas" icon={<RxFileText />} />
            
            <MenuButton title="Vagas Recomendadas" href="/usuario/vagas-recomendadas" icon={<FiBriefcase />} />

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
