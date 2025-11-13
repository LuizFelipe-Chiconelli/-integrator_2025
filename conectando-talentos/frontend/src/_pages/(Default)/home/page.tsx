import Banner from "../../../components/(default)/home/banner/banner"
import Presentation from "../../../components/(default)/home/presentation/presentation"
import FeaturedJobs from "../../../components/(default)/home/featured-jobs/featured-jobs"

export default function HomePage() {
    return (
        <main>
            <Banner />
            <Presentation />
            <FeaturedJobs />
        </main>
    )
}