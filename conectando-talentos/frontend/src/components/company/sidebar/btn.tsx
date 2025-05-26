import "./btn.css"

import { Link, useLocation } from "react-router-dom"

interface Props {
    title: string,
    icon: React.ReactNode,
    href: string
}

export default function MenuButton({ title, href, icon }: Props) {
    const location = useLocation()
    const active: string = location.pathname.includes(href) ? "active" : ""

    return (
        <Link
            className="text-decoration-none"
            to={href ?? "#"}
        >
            <button
                className={`menu-button bg-transparent w-100 d-flex align-items-center text-dark border-0 gap-2 ${active}`}
            >
                {icon}{title}
            </button>
        </Link>
    )
}