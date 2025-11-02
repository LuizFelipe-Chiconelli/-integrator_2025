import FormProvider from "@/components/form-kit/context"
import EmailField from "@/components/form-kit/fields/email-field"
import PasswordField from "@/components/form-kit/fields/password-field"

import { useState } from "react"
import { FaInfoCircle } from "react-icons/fa"
import { Button, Card } from "react-bootstrap"
import { signIn } from "@/actions/company/company"
import { Link, useNavigate } from "react-router-dom"
import { useNotificationContext } from "@/components/notifications/context"

export default function CompanySignInForm() {
    const navigate = useNavigate()

    const [loading, setLoading] = useState<boolean>(false)

    const { sendNotification } = useNotificationContext()

    const onSubmit = async (formData: Record<string, any>): Promise<void> => {
        if (loading) return

        setLoading(true)

        const res = await signIn(formData.email as string, formData.password as string)

        if (res.ok) {
            localStorage.setItem('empresa', JSON.stringify({
                id: res.company?.id,
                nome: res.company?.nome,
                email: res.company?.email,
            }))

            localStorage.setItem('tipo_usuario', 'empresa')

            sendNotification({ message: "Login realizado com sucesso!", type: "Success" })
            navigate('/minha-empresa')
            return
        }

        sendNotification({ message: res.message, type: "Error" })
        return setLoading(false)
    }

    return (
        <Card
            style={{ minWidth: 450 }}
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

                    <h5 className="mt-3 fw-bold">Area da Empresa</h5>
                    <p className="text-muted mb-0">
                        Ou <Link to="/auth/register-empresa">cadastre sua empresa</Link>
                    </p>
                </div>

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

                <div className="d-flex justify-content-end align-items-center mb-3">
                    <a href="#" className="text-primary text-decoration-none">
                        Esqueceu sua senha?
                    </a>
                </div>

                <Button type="submit" className="mb-2">Entrar</Button>
            </FormProvider>
        </Card>
    )
}