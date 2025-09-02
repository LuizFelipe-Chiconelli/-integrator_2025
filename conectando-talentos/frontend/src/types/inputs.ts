export interface InputHandler {
    getValue: () => string
    setValue(value: string): void
}

export interface Option {
    id: string,
    displayName: string
}
