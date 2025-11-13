import { Outlet } from "react-router-dom"

import Header from "../(default)/header/header"
import Footer from "../(default)/footer/footer"

export default function DefaultLayout() {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    )
}