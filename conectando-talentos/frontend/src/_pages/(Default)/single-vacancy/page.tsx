import VacancyInfo from "@/components/(default)/single-vacancy/section"

import { useParams } from "react-router-dom"

export default function SingleVacancyPage() {
    const { id } = useParams()

    return (
        <main>
            {id && (
                <VacancyInfo id={id} />
            )}
        </main>
    )
}