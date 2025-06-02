import { Button, Form } from "react-bootstrap"

import { IoDownloadOutline } from "react-icons/io5"

import FileInput from "../../../all/fileinput"

export default function UploadCurriculumForm() {
    return (
        <Form className="mt-3">
            <div className="row row-cols-lg-2">
                <div className="pe-0">
                    <FileInput
                        controlId="curriculumUpload"
                    />
                </div>

                <div>
                    <Button
                        className="border"
                        variant="light"
                    >
                        <IoDownloadOutline /> Baixar Currículo
                    </Button>
                </div>
            </div>
        </Form>
    )
}