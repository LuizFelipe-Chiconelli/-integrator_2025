import TopSearch from "@/components/(default)/vacancies/top-search"
import VacanciesGrid from "@/components/(default)/vacancies/vacancies-grid"

export default function VacanciesPage() {
    return (
        <main className="d-flex flex-column align-items-center">
            <TopSearch />
            <VacanciesGrid />
        </main>
    )
}