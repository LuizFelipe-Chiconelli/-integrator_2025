export type NotificationType = "Success" | "Error"

export interface NotificationObject {
    message: string
    type: NotificationType
}

export interface NotificationProps extends NotificationObject {
    id: string
    dismiss: (id: string) => void
}

export interface NotificationContextType {
    sendNotification: (object: NotificationObject) => void
}
