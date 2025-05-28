import MenuButton from "./btn"

import { RxFileText } from "react-icons/rx"
import { FaRegAddressCard } from "react-icons/fa6"
import { FiBriefcase, FiUser } from "react-icons/fi"

export default function Menu() {
    return (
        <div className="d-flex flex-column mt-4">
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
    )
}