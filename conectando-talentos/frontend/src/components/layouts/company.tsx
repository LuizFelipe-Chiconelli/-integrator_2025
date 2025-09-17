import { Outlet } from "react-router-dom"

import Sidebar from "../company/sidebar/sidebar"
import SessionProvider from "../company/session/context"
import OffcanvasSidebar from "../company/sidebar/offcanvas"

export default function CompanyLayout() {
    return (
        <SessionProvider>
            <div
                className="bg-light d-flex justify-content-start overflow-hidden"
                style={{ height: "100vh", width: "100vw" }}
            >
                <OffcanvasSidebar />
                <Sidebar />
                <Outlet />
            </div>
        </SessionProvider>
    )
}