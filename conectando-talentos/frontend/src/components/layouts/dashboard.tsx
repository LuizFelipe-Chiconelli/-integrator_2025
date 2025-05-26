import { Outlet } from "react-router-dom"

import Sidebar from "../company/sidebar/sidebar"

export default function DashboardLayout() {
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