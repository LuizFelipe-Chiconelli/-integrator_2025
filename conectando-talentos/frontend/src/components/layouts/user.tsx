import { Outlet } from "react-router-dom"

import Sidebar from "../user/sidebar/sidebar"
import SessionProvider from "../user/session/context"
import OffcanvasSidebar from "../user/sidebar/offcanvas"

export default function UserLayout() {
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