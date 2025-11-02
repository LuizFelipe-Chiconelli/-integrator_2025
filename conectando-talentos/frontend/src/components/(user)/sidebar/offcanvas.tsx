import { Button, Offcanvas } from "react-bootstrap"

// Hooks
import { useState } from "react"

import { IoIosMenu } from "react-icons/io"

import Profile from "./profile"
import Menu from "./menu"

export default function OffcanvasSidebar() {
    const [show, setShow] = useState<boolean>(false)

    const handleShow = (): void => { setShow(true) }
    const handleClose = (): void => { setShow(false) }

    return (
        <>
            <Button
                variant="light"
                className="position-absolute d-lg-none border"
                style={{ right: "10px", top: "5px" }}
                onClick={handleShow}
            >
                <IoIosMenu />
            </Button>

            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header>
                    <Profile />
                </Offcanvas.Header>

                <Offcanvas.Body>
                    <Menu />
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}
