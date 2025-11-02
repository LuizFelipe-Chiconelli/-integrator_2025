'use client'

import { AnimatePresence } from "framer-motion"
import { createContext, useContext, useCallback, useState } from "react"
import type { NotificationContextType, NotificationObject, NotificationProps } from "./types"

import Notification from "./notification"

export const notificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotificationContext = () => {
    const context = useContext(notificationContext)

    if (!context) {
        throw new Error("useNotificationContext deve ser usado dentro de um NotificationProvider!")
    }

    return context
}

interface Props {
    children: React.ReactNode
}

export default function NotificationProvider({ children }: Props) {
    const [notifications, setNotifications] = useState<NotificationProps[]>([])

    const sendNotification = useCallback((object: NotificationObject) => {
        const id: string = Date.now().toString()
        const notification: NotificationProps = { ...object, id, dismiss: dismissAction }

        setNotifications(prev => { return [...prev, notification] })

        setTimeout(() => {
            setNotifications(prev => {
                return prev.filter(obj => obj.id != notification.id)
            })
        }, 5000)
    }, [])

    const dismissAction = useCallback((id: string) => {
        setNotifications(prev => {
            return prev.filter(obj => obj.id != id)
        })
    }, [])

    return (
        <notificationContext.Provider value={{ sendNotification }}>
            {children}
            <div
                className="position-fixed d-flex flex-column overflow-visible"
                style={{
                    right: '32px',
                    bottom: '32px',
                    gap: '1.25rem',
                    zIndex: 50
                }}
            >
                <AnimatePresence>
                    {notifications.map((obj) => {
                        return (
                            <Notification
                                key={obj.id}
                                id={obj.id}
                                message={obj.message}
                                dismiss={obj.dismiss}
                                type={obj.type}
                            />
                        )
                    })}
                </AnimatePresence>
            </div>
        </notificationContext.Provider>
    )
}
