import Banner from "../components/sections/home/banner"
import Presentation from "../components/sections/home/presentation"
import FeaturedJobs from "../components/sections/home/featuredjobs"

export default function Home() {
    return (
        <main>
            <Banner />
            <Presentation />
            <FeaturedJobs />
        </main>
    )
}