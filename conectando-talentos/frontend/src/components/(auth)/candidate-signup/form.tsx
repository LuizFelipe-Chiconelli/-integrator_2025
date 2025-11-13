import FormProvider from "@/components/form-kit/context"
import EmailField from "@/components/form-kit/fields/email-field"
import PasswordField from "@/components/form-kit/fields/password-field"
import TextField from "@/components/form-kit/fields/text-field"

import { useState } from "react"
import { signUp } from "@/actions/user/user"
import { FaInfoCircle } from "react-icons/fa"
import { Form, Button, Card } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { useNotificationContext } from "@/components/notifications/context"

export default function CandidateSignUpForm() {
    const navigate = useNavigate()

    const [aceite, setAceite] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const { sendNotification } = useNotificationContext()

    const onSubmit = async (formData: Record<string, any>): Promise<void> => {
        if (loading) return

        setLoading(true)

        const payload: Record<string, string | boolean> = {
            name: formData.name as string,
            email: formData.email as string,
            password: formData.password as string,
            accept: aceite,
        }

        const res = await signUp(payload)

        if (res.ok) {
            sendNotification({ message: "Cadastro realizado com sucesso!", type: "Success" })
            navigate('/auth/login-usuario')
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
                    <h4 className="fw-bold">Crie sua conta</h4>
                    <p className="text-muted">
                        Já tem uma conta?{" "}
                        <Link to="/auth/login-usuario" className="text-primary">
                            Faça login
                        </Link>
                    </p>
                </div>

                <TextField
                    id="name"
                    name="name"
                    label="Nome completo"
                    placeholder="John Doe"
                    required
                />

                <EmailField
                    id="email"
                    name="email"
                    label="Email"
                    placeholder="exemplo@email.com"
                    required
                />

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
                    />
                </div>

                <Button type="submit" className="mb-2">Cadastrar</Button>
            </FormProvider>
        </Card>
    )
}