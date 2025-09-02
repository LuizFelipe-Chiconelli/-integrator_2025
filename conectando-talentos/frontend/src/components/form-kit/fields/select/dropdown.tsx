import SelectOption from "./option"

import { Option, SelectDropdownRef } from "@/types/form"
import { useState, useRef, useImperativeHandle, useEffect } from "react"

interface Props {
    ref?: React.Ref<SelectDropdownRef>
    options?: Option[]
    setIsOpened: (val: boolean) => void
    setSelectedOption: (opt: Option) => void
}

export default function Dropdown({ ref, options, setIsOpened, setSelectedOption }: Props) {

    // Hooks
    const optionsRef = useRef<HTMLLIElement[]>([])
    const [focusedIndex, setFocusedIndex] = useState<number>(0)

    // Funções internas
    const selectOption = () => {
        if (focusedIndex >= 0) {
            optionsRef.current?.[focusedIndex].click()
            setIsOpened(false)
        }
    }

    useEffect(() => {
        optionsRef.current?.[focusedIndex].scrollIntoView({
            behavior: "instant",
            block: "nearest"
        })
    }, [focusedIndex])

    // Retorno para parent component

    useImperativeHandle(ref, () => {
        return {
            setFocusedIndex,
            selectOption
        }
    }, [focusedIndex])

    return (
        <div
            className="absolute w-full min-h-10 max-h-40 bg-white top-[calc(100%+5px)] border-1 rounded-sm
            overflow-y-auto overscroll-contain z-50"
        >
            <ul className="w-full h-full min-h-10 flex flex-col justify-center items-center">
                {(!options || options.length < 1) && (
                    <span className="">Nenhuma opção disponível</span>
                )}

                {(options && options.length > 0) && options.map((option: Option, index: number) => {
                    return (
                        <SelectOption
                            key={option.id}
                            id={option.id}
                            label={option.label}
                            sublabel={option.sublabel}
                            index={index}
                            optionsRef={optionsRef}
                            setSelectedOption={setSelectedOption}
                            {...index === focusedIndex ? { active: true } : {}}
                        />
                    )
                })}
            </ul>
        </div>
    )
}