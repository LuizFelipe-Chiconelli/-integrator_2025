import { Outlet } from "react-router-dom"

import Sidebar from "../(user)/sidebar/sidebar"
import OffcanvasSidebar from "../(user)/sidebar/offcanvas"
import UserSessionProvider from "@/_session/user/context"

export default function UserLayout() {
    return (
        <UserSessionProvider>
            <div
                className="bg-light d-flex justify-content-start overflow-hidden"
                style={{ height: "100vh", width: "100vw" }}
            >
                <OffcanvasSidebar />
                <Sidebar />
                <Outlet />
            </div>
        </UserSessionProvider>
    )
}