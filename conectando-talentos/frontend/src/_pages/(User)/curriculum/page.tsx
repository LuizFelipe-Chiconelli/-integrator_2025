import ExperienceSection from "@/components/(user)/curriculum/experience/experience-section"
import QualificationSection from "@/components/(user)/curriculum/qualification/qualification-section"
import ScholaritySection from "@/components/(user)/curriculum/scholarity/scholarity-section"

export default function CurriculumPage() {
    return (
        <main className="w-100 d-flex flex-column justify-content-start align-items-center overflow-y-auto p-4 gap-3">
            <ScholaritySection />
            <ExperienceSection />
            <QualificationSection />
        </main>
    )
}