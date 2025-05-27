import MenuButton from "./btn"

import { RxFileText } from "react-icons/rx"
import { LuTableProperties } from "react-icons/lu"
import { FiBriefcase, FiUser } from "react-icons/fi"

export default function Menu() {
    return (
        <div className="d-flex flex-column mt-4">
            <MenuButton
                title="Perfil"
                href="/dashboard"
                icon={<FiUser />}
            />
            <MenuButton
                title="Publicar Vaga"
                href="/dashboard/publicar-vaga"
                icon={<FiBriefcase />}
            />
            <MenuButton
                title="Candidaturas"
                href="/dashboard/candidaturas"
                icon={<RxFileText />}
            />
            <MenuButton
                title="Vagas da Empresa"
                href="/dashboard/vagas"
                icon={<LuTableProperties />}
            />
        </div>
    )
}