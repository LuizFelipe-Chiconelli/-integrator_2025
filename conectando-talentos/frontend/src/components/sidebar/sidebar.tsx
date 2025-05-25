import Menu from "./menu"
import Profile from "./profile"

export default function Sidebar() {
    return (
        <aside
            className="bg-white h-100 d-flex flex-column border-end pt-3 shadow-sm"
            style={{ width: "260px", minWidth: "260px" }}
        >
            <Profile />
            <Menu />
        </aside>
    )
}