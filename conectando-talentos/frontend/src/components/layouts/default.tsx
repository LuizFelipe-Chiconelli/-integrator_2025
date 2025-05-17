import type React from "react"

import Header from "../header/header"
import Footer from "../footer/footer"

interface Props {
    children: React.ReactNode
}

export default function DefaultLayout({ children }: Props) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    )
}