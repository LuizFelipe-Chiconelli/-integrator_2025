import FormProvider from "@/components/form-kit/context"
import TextArea from "@/components/form-kit/fields/text-area"
import TextField from "@/components/form-kit/fields/text-field"
import CNPJField from "@/components/form-kit/fields/cnpj-field"
import EmailField from "@/components/form-kit/fields/email-field"
import PasswordField from "@/components/form-kit/fields/password-field"

import { useState } from "react"
import { signUp } from "@/actions/company/company"
import { FaInfoCircle } from "react-icons/fa"
import { Form, Button, Card } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { useNotificationContext } from "@/components/notifications/context"

export default function CompanySignUpForm() {
    const navigate = useNavigate()

    const [aceite, setAceite] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const { sendNotification } = useNotificationContext()

    const onSubmit = async (formData: Record<string, any>): Promise<void> => {
        if (loading) return

        setLoading(true)

        const payload: Record<string, string | boolean> = {
            name: formData.name,
            cnpj: formData.cnpj,
            address: formData.address,
            description: formData.description,
            email: formData.email,
            password: formData.password
        }

        const res = await signUp(payload)

        if (res.ok) {
            sendNotification({ message: "Cadastro realizado com sucesso!", type: "Success" })
            navigate('/auth/login-empresa')
            return
        }

        sendNotification({ message: res.message, type: "Error" })
        return setLoading(false)
    }

    return (
        <Card
            style={{ minWidth: 500 }}
            className="shadow p-4"
        >
            <FormProvider
                className="d-flex flex-column"
                onSubmit={onSubmit}
            >
                <div className="text-center mb-4">
                    <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
                        <FaInfoCircle size={25} className="text-dark" />
                        <span className="logo-infojobs text-dark fs-3">InformJobs</span>
                    </div>
                    <h4 className="fw-bold">Cadastre sua empresa</h4>
                    <p className="text-muted">
                        Já tem uma conta?{" "}
                        <Link to="/auth/login-empresa" className="text-primary">
                            Faça login
                        </Link>
                    </p>
                </div>

                <TextField
                    id="name"
                    name="name"
                    label="Nome da empresa"
                    placeholder="FASM Tech"
                    required
                />

                <CNPJField
                    id="cnpj"
                    name="cnpj"
                    label="CNPJ"
                    placeholder="00.000.000/0001-00"
                    required
                />

                <TextField
                    id="address"
                    name="address"
                    label="Endereço"
                    placeholder="Rua das graças, 100"
                    required
                />

                <TextArea
                    id="description"
                    name="description"
                    label="Descrição da empresa"
                    placeholder="Fale um pouco sobre sua empresa"
                />

                <EmailField
                    id="email"
                    name="email"
                    label="Email corporativo"
                    placeholder="exemplo@email.com"
                    required
                />

                <div className="row row-cols-2">
                    <PasswordField
                        id="password"
                        name="password"
                        label="Senha"
                        placeholder="********"
                        required
                    />

                    <PasswordField
                        id="confirm-password"
                        name="confirm_password"
                        label="Confirmar senha"
                        placeholder="********"
                        required
                    />
                </div>

                <div className="d-flex justify-content-start align-items-center mb-3">
                    <Form.Check
                        type="checkbox"
                        id="aceiteTermo"
                        className="mb-4"
                        label={
                            <>
                                Li e aceito o{" "}
                                <Link
                                    to="/termo.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Termo de Uso
                                </Link>
                            </>
                        }
                        checked={aceite}
                        onChange={e => setAceite(e.target.checked)}
                        required
                    />
                </div>

                <Button type="submit" className="mb-2">Cadastrar</Button>
            </FormProvider>
        </Card>
    )
}