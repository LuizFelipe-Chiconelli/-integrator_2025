import { Button, Form } from "react-bootstrap"

import { LuDownload } from "react-icons/lu"

import FileInput from "../../../all/fileinput"

export default function UploadCurriculumForm() {
    return (
        <Form className="mt-3">
            <div className="d-flex flex-column flex-lg-row gap-2">
                <div className="pe-lg-0">
                    <FileInput
                        text="Enviar Currículo"
                        controlId="curriculumUpload"
                    />
                </div>

                <div className="">
                    <Button
                        className="border"
                        variant="light"
                    >
                        <LuDownload /> Baixar Currículo
                    </Button>
                </div>
            </div>
        </Form>
    )
}