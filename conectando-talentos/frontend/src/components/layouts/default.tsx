import { Outlet } from "react-router-dom"

import Header from "../header/header"
import Footer from "../footer/footer"

export default function DefaultLayout() {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    )
}