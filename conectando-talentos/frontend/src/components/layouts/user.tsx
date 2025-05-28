import { Outlet } from "react-router-dom"

import Sidebar from "../user/sidebar/sidebar"

export default function UserLayout() {
    return (
        <div
            className="bg-light d-flex justify-content-start overflow-hidden"
            style={{ height: "100vh", width: "100vw" }}
        >
            <Sidebar />
            <Outlet />
        </div>
    )
}