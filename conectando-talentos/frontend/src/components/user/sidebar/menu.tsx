import MenuButton from "./btn"

import { RxFileText } from "react-icons/rx"
import { FaRegAddressCard } from "react-icons/fa6"
import { FiBriefcase, FiUser, FiLogOut, FiHome } from "react-icons/fi"

export default function Menu() {
    return (
        <div className="d-flex flex-column mt-4 h-100 justify-content-between">
            {/* ----------------- Menu principal ----------------- */}
            <div>
                <MenuButton
                    title="Perfil"
                    href="/usuario"
                    icon={<FiUser />}
                />
                <MenuButton
                    title="Meu Currículo"
                    href="/usuario/curriculo"
                    icon={<FaRegAddressCard />}
                />
                <MenuButton
                    title="Minhas Candidaturas"
                    href="/usuario/candidaturas"
                    icon={<RxFileText />}
                />
                <MenuButton
                    title="Vagas Recomendadas"
                    href="/usuario/vagas-recomendadas"
                    icon={<FiBriefcase />}
                />
            </div>

            {/* ----------------- Botões extras no rodapé ----------------- */}
            <div className="mt-4 border-top pt-3">
                <MenuButton
                    title="Página Inicial"
                    href="/"
                    icon={<FiHome />}
                />
                <MenuButton
                    title="Encerrar Sessão"
                    href="/logout"   // você pode ajustar a rota conforme seu back
                    icon={<FiLogOut />}
                />
            </div>
        </div>
    )
}
