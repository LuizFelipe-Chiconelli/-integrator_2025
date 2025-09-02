import { Option } from "@/types/form"

interface Props extends Option {
    index: number
    active?: boolean,
    optionsRef: React.RefObject<HTMLLIElement[]>
    setSelectedOption: (opt: Option) => void
}

export default function SelectOption({
    id,
    label,
    sublabel,
    index,
    active,
    optionsRef,
    setSelectedOption
}: Props) {
    const handleSelect = (e: React.MouseEvent<HTMLLIElement>) => {
        e.preventDefault()
        setSelectedOption({ id, label, sublabel })
    }

    return (
        <li
            ref={(el: HTMLLIElement) => { optionsRef.current[index] = el }}
            className={`w-full border-b cursor-pointer hover:bg-black/10 last:border-none py-2 px-3
            ${active ? "bg-black/10" : ""}`}
            onClick={handleSelect}
            tabIndex={-1}
            role="option"
        >
            <span>{label}</span>
            {sublabel && (
                <span>{sublabel}</span>
            )}
        </li>
    )
}
