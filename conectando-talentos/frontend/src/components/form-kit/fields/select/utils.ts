import { SelectDropdownRef } from "@/types/form"

export function handleSelectKeyDown(
    e: React.KeyboardEvent<HTMLDivElement>,
    isOpened: boolean,
    setIsOpened: (val: boolean) => void,
    dropdownRef: React.RefObject<SelectDropdownRef | null>,
    searchRef: React.RefObject<HTMLInputElement | null>,
    optionsLength: number
) {
    switch (e.key) {
        case " ":
        case "Spacebar":
            if (!isOpened) {
                e.preventDefault()
                setIsOpened(true)
            }
            break

        case "Escape":
            e.preventDefault()
            setIsOpened(false)
            break

        case "Tab":
            setIsOpened(false)
            break

        case "ArrowDown":
            e.preventDefault()
            dropdownRef.current?.setFocusedIndex(prev => Math.min(prev + 1, optionsLength - 1))
            break

        case "ArrowUp":
            e.preventDefault()
            dropdownRef.current?.setFocusedIndex(prev => Math.max(prev - 1, 0))
            break

        case "Enter":
            e.preventDefault()
            e.stopPropagation()
            dropdownRef.current?.selectOption()
            break

        default:
            // Volta para o input de pesquisa se for um caracter alfanumérico
            if (e.key.length === 1 && searchRef.current) searchRef.current.focus()
            if (!isOpened) setIsOpened(true)
            break
    }
}