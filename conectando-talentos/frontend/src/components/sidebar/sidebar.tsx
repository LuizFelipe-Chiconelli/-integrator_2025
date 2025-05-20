import Menu from "./menu"
import Profile from "./profile"

export default function Sidebar() {
    return (
        <aside
            className="h-100 d-flex flex-column border-end pt-3"
            style={{ width: "260px" }}
        >
            <Profile />
            <Menu />
        </aside>
    )
}