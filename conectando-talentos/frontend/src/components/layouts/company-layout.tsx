import { Outlet } from "react-router-dom"

import Sidebar from "../(company)/sidebar/sidebar"
import OffcanvasSidebar from "../(company)/sidebar/offcanvas"
import CompanySessionProvider from "@/_session/company/context"

export default function CompanyLayout() {
    return (
        <CompanySessionProvider>
            <div
                className="bg-light d-flex justify-content-start overflow-hidden"
                style={{ height: "100vh", width: "100vw" }}
            >
                <OffcanvasSidebar />
                <Sidebar />
                <Outlet />
            </div>
        </CompanySessionProvider>
    )
}